import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import { Transactions } from '../models/transactions/Transactions';
import { BookingsWithPassengerAndDriver } from '../models/bookings/BookingsWithPassengerAndDriver';

pdfMake.vfs = pdfFonts.vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfGenerationService {
  private logoImage: string = ''; // Store Base64 logo

  constructor() {
    this.loadLogo();
  }

  private loadLogo() {
    const img = new Image();
    img.src = '../../../assets/images/logo.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        this.logoImage = canvas.toDataURL('image/png');
      }
    };
    img.onerror = () => console.error('Failed to load logo image.');
  }

  /**
   * Generates a reusable PDF header
   * @param admin - Admin
   * @param dateIssued - Date of issue
   * @param totalBookings - Total number of bookings
   * @returns Content[] - Formatted header content
   */
  generateHeader(
    admin: string,
    dateIssued: string,
    totalBookings: string
  ): Content {
    return {
      columns: [
        {
          image: this.logoImage,
          width: 150,
        },
        {
          width: '*',
          alignment: 'right',
          stack: [
            {
              text: 'Booking',
              color: '#333333',
              fontSize: 28,
              bold: true,
              margin: [0, 0, 0, 15],
            },
            {
              margin: [0, 10, 0, 0],
              table: {
                widths: ['*', 100],
                body: [
                  [
                    {
                      text: 'Admin',
                      color: '#aaaaab',
                      bold: true,
                      fontSize: 12,
                      alignment: 'right',
                    },
                    {
                      text: admin,
                      bold: true,
                      color: '#333333',
                      fontSize: 12,
                      alignment: 'right',
                    },
                  ],
                  [
                    {
                      text: 'Date Issued',
                      color: '#aaaaab',
                      bold: true,
                      fontSize: 12,
                      alignment: 'right',
                    },
                    {
                      text: dateIssued,
                      bold: true,
                      color: '#333333',
                      fontSize: 12,
                      alignment: 'right',
                    },
                  ],
                  [
                    {
                      text: 'Total Bookings',
                      color: '#aaaaab',
                      bold: true,
                      fontSize: 12,
                      alignment: 'right',
                    },
                    {
                      text: totalBookings,
                      bold: true,
                      color: '#333333',
                      fontSize: 12,
                      alignment: 'right',
                    },
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ],
        },
      ],
    };
  }

  /**
   * Generates a full PDF using the reusable header
   */

  /**
   * Generates a table for booking transactions in a PDF
   * @param transactions - Array of booking transactions with passenger and driver details
   * @returns Content - Formatted table content for PDF
   */
  generateBookingTable(
    transactions: BookingsWithPassengerAndDriver[]
  ): Content {
    // Define table body
    const tableBody = [
      // Table header
      [
        { text: 'ID', bold: true },
        { text: 'Passenger', bold: true },
        { text: 'Driver', bold: true },
        { text: 'Pickup', bold: true },
        { text: 'Drop-off', bold: true },
        { text: 'Status', bold: true },
        { text: 'Amount', bold: true },
        { text: 'Last Updated', bold: true },
      ],
    ];

    // Add transaction rows
    transactions.forEach((e) => {
      const id = e.transactions?.id || '';
      const passenger = e.passenger?.name || '';
      const driver = e.driver?.name || '';
      const pickup = e.transactions?.locationDetails?.pickup?.name || '';
      const dropOff = e.transactions?.locationDetails?.dropOff?.name || '';
      const status = e.transactions?.status || '';
      const amount = e.transactions?.payment?.amount
        ? `₱ ${e.transactions.payment.amount.toLocaleString()}`
        : '';
      const paymentStatus = `${amount} - ${
        e.transactions?.payment?.status || ''
      }`;
      const lastUpdated = e.transactions?.updatedAt
        ? new Date(e.transactions.updatedAt).toLocaleDateString()
        : '';

      // Add row to table body
      tableBody.push([
        { text: id, bold: false }, // make the fontsize 12
        { text: passenger, bold: false },
        { text: driver, bold: false },
        { text: pickup, bold: false },
        { text: dropOff, bold: false },
        { text: status, bold: false },
        { text: paymentStatus, bold: false },
        { text: lastUpdated, bold: false },
      ]);
    });

    return {
      table: {
        widths: ['auto', 'auto', 'auto', '*', '*', 'auto', 'auto', 'auto'],
        headerRows: 1,
        body: tableBody,
      },
      layout: 'lightHorizontalLines',
      style: 'tableBody',
    };
  }

  generatePdf(contents: Content[]) {
    let docDefinition: TDocumentDefinitions = {
      pageOrientation: 'landscape',
      content: contents,
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 8,
        },
        tableBody: {
          fontSize: 8,
        },
      },
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
