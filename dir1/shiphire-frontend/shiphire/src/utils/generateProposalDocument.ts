// src/util/pdfUtils.ts
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {
    PROPOSALOWNERFILEPATH,
    RFQFILEPATH,
    removeDataToLocalStorage,
    setDataToLocalStorage,
} from '../configs';
import {
    GetTransactionByRentalId,
    GetUserProfileResponse,
    ProposalOwnerRequest,
    RenterData,
    RenterUserData,
    RequestForaQuoteRequest,
    ShipDatas,
    ShipOwnerCompanyData,
    ShipOwnerUserData,
    Transaction,
    UserCompanyData,
} from '../types';

const generateProposalDocument = async (
    proposalValues: ProposalOwnerRequest,
    shipName: String,
    shipCategory: String,
    renterData: RenterData,
    renterUserData: RenterUserData,
    shipOwnerUserData: ShipOwnerUserData,
    shipOwnerCompanyData: ShipOwnerCompanyData,
    rentalDuration: number,
    rentalStartDate: String,
    rentalEndDate: String,
    offeredPrice: number,
): Promise<void> => {
    const note = proposalValues.note;

    try {
        const html = `
        <!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Boat Rental Proposal</title>
    </head>
    <body>
        <div>
            <h2>Boat Rental Proposal</h2>

            <p>
                To,<br />
                ${renterData.company.name}<br/>
                ${renterData.name}<br />
                ${renterUserData.phoneNumber}<br />
                ${renterUserData.email}
            </p>

            <p>Dear ${renterData.name},</p>

            <p>
                We appreciate your interest in renting our ship and are excited
                to provide you with an exceptional seafaring experience. As
                experienced providers of ships and marine fleet, we are
                dedicated to ensuring a safe, comfortable, and memorable sailing
                adventure.
            </p>

            <p>Below is the details of your offer for the ship rental:</p>

            <ul>
                <li><strong>Boat Name:</strong> ${shipName}</li>
                <li><strong>Type of Boat:</strong> ${shipCategory}</li>
                <li><strong>Commodity:</strong> Person</li>
                <li><strong>Tonnage:</strong> [Tonnage]</li>
                <li>
                    <strong>Rental Dates:</strong> From ${rentalStartDate} to
                    ${rentalEndDate}
                </li>
                <li>
                    <strong>Rental Duration:</strong> ${rentalDuration} days
                </li>
                <li><strong>Load Address:</strong> Mahakam</li>
                <li><strong>Unloading Address:</strong> Makassar</li>
            </ul>

            <p>
                <strong
                    >Additional Information (optional):</strong> Helmet
            </p>

            <p><strong>Rental Price:</strong> ${offeredPrice}</p>

            <p><strong>Payment Method:</strong> Transfer to Bank ${shipOwnerCompanyData.bankName}</p>

            <p><strong>Bank Account Name:</strong> ${shipOwnerCompanyData.bankAccountName}</p>

            <p><strong>Bank Account Number:</strong> ${shipOwnerCompanyData.bankAccountNumber}</p>

            <p><strong>Note from Owner:</strong> ${note}</p>

            <p>
                We would like to emphasize that we have experienced captains and
                crew to ensure safety and comfort during your journey. We always
                maintain our boats in top condition and adhere to all maritime
                safety standards.
            </p>

            <p>
                We look forward to the opportunity to serve you and make your
                sea voyage an unforgettable experience. Please reach out to us
                at ${shipOwnerUserData.phone} or via email at ${shipOwnerUserData.email} for more
                information or to confirm your reservation.
            </p>

            <p>Yours sincerely,</p>

            <p>
                <em> ${shipOwnerUserData.name}<br /> </em>
            </p>
        </div>
        <div title="footer">
        <p align="center"> Service Provider by ShipHire App from SMI Teknologi 2023 ©</p>
        </div>
    </body>
</html>

    `;

        const options = {
            html,
            // fileName: `Proposal-${renterValues.name}`,
            fileName: `Proposal-New`,
            directory: 'Documents',
        };

        const pdf = await RNHTMLtoPDF.convert(options);
        const filePath = pdf.filePath;
        removeDataToLocalStorage(PROPOSALOWNERFILEPATH);
        setDataToLocalStorage(PROPOSALOWNERFILEPATH, { path: filePath });
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};

export default generateProposalDocument;
