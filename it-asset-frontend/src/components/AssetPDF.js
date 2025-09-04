import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#E4E4E4',
        padding: 30,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
        backgroundColor: 'white',
        border: '1px solid #ccc',
    },
    heading: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 12,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 12,
        marginBottom: 10,
    },
});

const AssetPDF = ({ asset }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.heading}>IT Asset Clearance Form</Text>
                
                <Text style={styles.label}>Employee Details</Text>
                <Text style={styles.value}>Employee ID: {asset.employee_id}</Text>
                <Text style={styles.value}>Name: {asset.name}</Text>
                <Text style={styles.value}>Position: {asset.position}</Text>
                <Text style={styles.value}>Department: {asset.department}</Text>
                <Text style={styles.value}>Email: {asset.email}</Text>
                
                <Text style={styles.label}>Laptop Details</Text>
                <Text style={styles.value}>Laptop: {asset.laptop}</Text>
                <Text style={styles.value}>Status: {asset.laptop_status}</Text>
                <Text style={styles.value}>Tag #: {asset.laptop_tag_num}</Text>
                
                {/* Add the rest of the fields here similarly */}
                
                <Text style={styles.label}>Remarks</Text>
                <Text style={styles.value}>{asset.remarks}</Text>
                
                <Text style={styles.label}>Clearance Status</Text>
                <Text style={styles.value}>{asset.status}</Text>
            </View>
        </Page>
    </Document>
);

export const DownloadButton = ({ asset }) => (
    <PDFDownloadLink
        document={<AssetPDF asset={asset} />}
        fileName={`asset-form-${asset.employee_id}.pdf`}
        style={{ textDecoration: 'none', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}
    >
        {({ blob, url, loading, error }) => (loading ? 'Generating PDF...' : 'Download PDF')}
    </PDFDownloadLink>
);