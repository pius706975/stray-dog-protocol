// src/util/pdfUtils.ts
import moment from 'moment';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {
    RFQFILEPATH,
    removeDataToLocalStorage,
    setDataToLocalStorage,
} from '../configs';
import { DynamicFormType, RenterUserData, UserCompanyData } from '../types';

const generateRFQDocument = async (
    rfqValues: any,
    dynamicForms: DynamicFormType[],
    personalValues: RenterUserData,
    renterCompanyValues: UserCompanyData,
    rentalDuration: number,
    shipCategory: string,
    shipCompany: {
        name: string;
        companyType: string;
        address: string;
    },
    renterCompanyAddress: string,
): Promise<void> => {
    let formValues: any = {};
    const formattedOwnerCompanyName = `${shipCompany.companyType}. ${shipCompany.name}`;
    const renterCompanyName = `${renterCompanyValues.companyType}. ${renterCompanyValues.name}`;

    for (const key of dynamicForms) {
        if (key.dynamicInput.fieldType === 'date') {
            const date = moment(rfqValues[key.dynamicInput.fieldName]).format(
                'DD MMMM YYYY',
            );

            formValues[key.dynamicInput.label] = date;
        } else if (key.dynamicInput.fieldName === 'additionalInformation') {
            formValues['Additional Information'] =
                rfqValues[key.dynamicInput.fieldName];
        } else {
            formValues[key.dynamicInput.label] =
                rfqValues[key.dynamicInput.fieldName];
        }
    }

    try {
        const html = `
        <html>
        <head>
          
          <style type="text/css">
            @page { size: 10in 11in; margin-left: 1in; margin-right: 1in; margin-top: 0in; margin-bottom: 0.3in }
            
          </style>
        </head>
        <body>
        <p style="font-size:0.8em"> No	: 001/SH-LOI/I/1</p>
        <p style="font-size:0.8em"> Attachment	: 1</p>
        <p style="font-size:0.8em"> Regarding : Latter Of Interest (LOI) Rent a ${shipCategory}</p>
        
        <br/>
        
        <p style="font-size:0.8em">Head of HRD</font></p>
        <p style="font-size:0.8em">${formattedOwnerCompanyName}</font></p>
       
        <br/>
        
       
        <p style="font-size:0.7em" >With respect, </p>
        <p style="font-size:0.7em" >Along with this letter, we from ${renterCompanyName}, want to ask Ship Rent Type : ${
            rfqValues.shipRentType
        } with Price quote for rental that we will use ${
            rfqValues.needs
        }, we attach personal data and completeness others as follows:</p>
        <ol>
            <li style="font-size:0.7em"><p>Renter name	: ${
                personalValues.name
            }</p></li>
            <li style="font-size:0.7em"><p>Address	: ${renterCompanyAddress}</p></li>
            <li style="font-size:0.7em"><p>Phone number	: ${
                personalValues.phoneNumber
            }</p></li>
            <li style="font-size:0.7em"><p>Email: ${
                personalValues.email
            }</p></li>
            <li style="font-size:0.7em"><p>Rental duration	    :  ${rentalDuration} days</p></li>
            ${Object.keys(formValues)
                .map(key => {
                    const value = formValues[key];
                    if (formValues[key] === '') {
                        return ``;
                    } else if (key === 'Rental Date') {
                        const dateSplit = value.split(' to ');

                        const startDate = moment(
                            dateSplit[0],
                            'DD MMM YYYY',
                        ).format('DD MMMM YYYY');
                        const endDate = moment(
                            dateSplit[1],
                            'DD MMM YYYY',
                        ).format('DD MMMM YYYY');

                        return `
                            <li style="font-size:0.7em"><p>Start Date : ${startDate}</p></li>
                            <li style="font-size:0.7em"><p>End Date : ${endDate}</p></li>
                        `;
                    } else {
                        return `<li style="font-size:0.7em"><p>${key} : ${value}</p></li>`;
                    }
                })
                .join('')}
        </ol>
        <br/>  
        <p>Please make a price quote in accordance with the conditions above and we can receive it as soon as possible. If any information changes, we will inform you further.</p>
        <p>Thus we wrote this letter, we thank you for your cooperation.</p>
        <p><br/>
        <br/>
        
        </p>
        <p>Regards,</p>

        <p><br/>
        <br/>
        
        </p>
        <p>${personalValues.name}</p>
        <p>${renterCompanyName}</p>
        <p><br/>
        
        </p>
        <div title="footer">
        <p align="center"> Service Provider by ShipHire App from SMI Teknologi 2023 ©</p>
        </div>
        </body>
        </html>
    `;

        const options = {
            html,
            fileName: `RFQ-${personalValues.name}-${rfqValues.rentalStartDate}`,
            directory: 'Documents',
        };

        const pdf = await RNHTMLtoPDF.convert(options);
        const filePath = pdf.filePath;
        removeDataToLocalStorage(RFQFILEPATH);
        setDataToLocalStorage(RFQFILEPATH, { path: filePath });
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};

export default generateRFQDocument;
