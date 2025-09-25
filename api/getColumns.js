export default async function handler(req, res) {
  const sheetId = "4451436415897476";  // replace with your real sheet ID
  const token  = process.env.SMARTSHEET_TOKEN; // we'll set this in Vercel settings

  const response = await fetch(`https://api.smartsheet.com/2.0/sheets/${sheetId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  res.status(200).json(data.columns);  // return only the columns array
}
