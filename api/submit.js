export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
   const { item, height, length, width, slot, ti, hi } = req.body;

    const response = await fetch(
      `https://api.smartsheet.com/2.0/sheets/${process.env.SHEET_ID}/rows`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.SMARTSHEET_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          toTop: true,
          cells: [
            { columnId: 5779083682860932, value: item },
            { columnId: 3527283869175684, value: height },
            { columnId: 8030883496546180, value: length },
            { columnId: 712534102069124, value: width },
            { columnId: 5216133729439620, value: slot },
            { columnId: 8135964837498756, value: ti },
            { columnId: 817615443021700, value: hi }
          ]
        })
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send to Smartsheet" });
  }
}
