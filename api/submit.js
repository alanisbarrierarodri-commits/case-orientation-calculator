export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { itemNumber, length, width, height, slotResults } = req.body;

    if (!Array.isArray(slotResults) || slotResults.length === 0) {
      return res.status(400).json({ error: "No slot results provided" });
    }

    // Map slotResults to Smartsheet rows
    const rows = slotResults.map(r => ({
      cells: [
        { columnId: 5779083682860932, value: itemNumber },
        { columnId: 3527283869175684, value: height },
        { columnId: 8030883496546180, value: length },
        { columnId: 712534102069124, value: width },
        { columnId: 5216133729439620, value: r.slotHeight },
        { columnId: 8135964837498756, value: r.TI },
        { columnId: 817615443021700, value: r.HI },
      ]
    }));

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
          rows
        })
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send to Smartsheet", details: err.message });
  }
}
