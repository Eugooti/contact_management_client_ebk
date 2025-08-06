/**
 * Downloads contact data as a CSV file
 * @param {Array} data - Array of contact objects
 * @param {string} filename - Name for the downloaded file (without .csv extension)
 */
export const downloadContactsAsCSV = (data, filename = 'contacts') => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('No valid data provided for CSV export');
        return;
    }

    try {
        // Extract headers from the first object's keys
        const headers = Object.keys(data[0]);

        // Build CSV content
        let csvContent = '';

        // Add headers
        csvContent += headers.join(',') + '\r\n';

        // Add data rows
        data.forEach(item => {
            const row = headers.map(header => {
                // Escape quotes and wrap in quotes if contains commas
                const value = item[header] !== undefined ? String(item[header]) : '';
                return `"${value.replace(/"/g, '""')}"`;
            });
            csvContent += row.join(',') + '\r\n';
        });

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error generating CSV:', error);
    }
};