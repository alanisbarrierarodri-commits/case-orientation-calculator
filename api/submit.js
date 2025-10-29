export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {dcNumber, associateName, dockDoor, itemNumber, length, width, height, slotResults } = req.body;

    if (!dcNumber || !itemNumber || !length || !width || !height) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const COLUMNS = {
      DC: 3035087663484804,
      ASSOCIATE: 8049847480045444,
      DOCK_DOOR: 731498085568388,
      ITEM: 1275484055490436,
      HEIGHT: 3527283869175684,
      LENGTH: 8030883496546180,
      WIDTH: 712534102069124,
    };

      const rows = [
    {
      toTop: true,
      cells: [
        { columnId: COLUMNS.DC, value: dcNumber },
        { columnId: COLUMNS.ASSOCIATE, value: associateName },
        { columnId: COLUMNS.DOCK_DOOR, value: dockDoor },
        { columnId: COLUMNS.ITEM, value: itemNumber },
        { columnId: COLUMNS.HEIGHT, value: height },
        { columnId: COLUMNS.LENGTH, value: length },
        { columnId: COLUMNS.WIDTH, value: width },
      ]
    }
  ];

    const response = await fetch(
      `https://api.smartsheet.com/2.0/sheets/${process.env.SHEET_ID}/rows`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.SMARTSHEET_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(rows)
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to send to Smartsheet",
      details: err.message
    });
  }
}
