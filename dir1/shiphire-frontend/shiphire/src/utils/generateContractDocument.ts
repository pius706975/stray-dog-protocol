import moment from 'moment';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {
    CONTRACTFILEPATH,
    removeDataToLocalStorage,
    setDataToLocalStorage,
} from '../configs';
import {
    ShipOwnerUserData,
    UserCompanyData,
    ShipOwnerCompanyData,
    Transaction,
    RenterName,
} from '../types';

const generateContractDocument = async (
    contractData: Transaction,
    renterName: RenterName,
    renterCompanyData: UserCompanyData,
    shipOwnerData: ShipOwnerUserData,
    shipOwnerCompanyData: ShipOwnerCompanyData,
    rentalDuration: Number,
    rentalDateStart: String,
    rentalDateEnd: String,
    dateNow: Date,
): Promise<void> => {
    const dateToday = moment(dateNow).format('DD MMMM YYYY');
    console.log('shipOwnerCompanyData: ', shipOwnerCompanyData);
    try {
        const html = `
        <html>
        <head>
          
          <style type="text/css">
            @page { size: 10in 11in; margin-left: 1in; margin-right: 1in; margin-top: 0in; margin-bottom: 0.3in }
            
          </style>
        </head>
        <body>
        <h1 style="text-align: center;">Ship Rental Agreement Letter</h1>
        <h3 style="text-align: center;">Between</h3>
        <h2 style="text-align: center;">${shipOwnerCompanyData.name} with ${renterCompanyData.name}</h2>
        <hr />
        <p style="font-size:1em; text-align: center;"> No	: 001/SH-LOI/I/1</p>
        <p style="font-size:1em; text-align: center;"> Attachment	: 2</p>
        <br />
        <p>On this day, ${dateToday}, the parties whose names are below :</p>
        <ol>
          <li>${shipOwnerCompanyData.name}, located at ${shipOwnerCompanyData.address}, in this case represented by ${shipOwnerData.name} as Ship Owner Company, acting in his position and hereinafter referred to : <br/> <b>---THE FIRST PARTY---</b></li>
          <li>${renterCompanyData.companyType}. ${renterCompanyData.name}, located at ${renterCompanyData.address}, in this case represented by ${renterName.name} as Renter, acting in his position and hereinafter referred to : <br/> <b>---THE SECOND PARTY---</b></li>
        </ol>
        <p>Both parties have agreed to make a Ship Rental Agreement Letter, with the following conditions :</p>
        <br/>
        
        <h2 style="text-align: center;">Article 1</h2>
        <h2 style="text-align: center;">Ship Specifications</h2>
        <p>Ship specifications are as follows :</p>
        <ul>
          <li>Ship Name : ${contractData.ship.name}</li>
          <li>Ship Category : ${contractData.ship.category.name}</li>
          <li>Ship Length : ${contractData.ship.size.length}</li>
          <li>Ship Width : ${contractData.ship.size.width}</li>
          <li>Ship Height : ${contractData.ship.size.height}</li>
        </ul>
        <br/>
        
        <h2 style="text-align: center;">Article 2</h2>
        <h2 style="text-align: center;">Ship Rental Period</h2>
        <p>Ship rental period is as follows :</p>
        <ol>
            <li>The term of the ship rental contract is ${rentalDuration}.</li>
            <li>
                Begins when the ship is received by <b>THE SECOND PARTY</b>, on
                the date ${rentalDateStart}.
            </li>
            <li>
                And ends when the ship is returned by <b>THE SECOND PARTY</b> to
                <b>THE FIRST PARTY</b>, on the date ${rentalDateEnd}.
            </li>
            <li>
                <b>THE SECOND PARTY</b> is not permitted to transfer the right
                to rent the ship (over contract) to any party without the
                knowledge and written consent of <b>THE FIRST PARTY</b>. If an
                overcontract occurs, <b>THE FIRST PARTY</b> has the right to
                impose sanctions on <b>THE SECOND PARTY</b>, by taking the ship
                unilaterally. And all costs incurred are the responsibility of
                <b>THE SECOND PARTY</b>.
            </li>
        </ol>
        <br/>

        <h2 style="text-align: center">Article 3</h2>
        <h2 style="text-align: center">Ship Rental Price</h2>
        <p>Ship rental price is as follows :</p>
        <ol>
          <li>The price for renting the ship in question is: ${contractData.offeredPrice}.</li>
          <li>
                Payment of the ship rental price <b>THE SECOND PARTY</b> to
                <b>THE FIRST PARTY</b> is made before this contract is made.
            </li>
        </ol>
        <br />

        <h2 style="text-align: center">Article 4</h2>
        <h2 style="text-align: center">Closing</h2>
        <p style="text-align: center">
            Other matters which have not been regulated in this Agreement, will
            be regulated later in the form of an additional Agreement and will
            be used as an additional Agreement or addendum, which will later
            form an inseparable part of this Agreement.
        </p>
        <br />
        <br />
        
        <div title="footer">
        <p align="center"> Service Provider by ShipHire App from SMI Teknologi 2023 ©</p>
        </div>
        </body>
        </html>
        `;
        const options = {
            html,
            fileName: `Contract-${renterName.name}-${rentalDuration}`,
            directory: 'Documents',
        };

        const pdf = await RNHTMLtoPDF.convert(options);
        const filePath = pdf.filePath;
        removeDataToLocalStorage(CONTRACTFILEPATH);
        setDataToLocalStorage(CONTRACTFILEPATH, { path: filePath });
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};

export default generateContractDocument;
