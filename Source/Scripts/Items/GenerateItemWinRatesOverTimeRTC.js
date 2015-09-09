//
// Calculate the number of times items were used and their win
// count over time.
//
// Dependencies:
//   PrepareMatchEvents
//
db.MatchEvents.aggregate(
  [
    {
      $match: {
        "eventType": "ITEM_PURCHASED"
      }
    },
    {
      $group: {
        _id: {
          time: { $add: [{ $multiply: [{ $month: '$time' }, 10000] }, { $multiply: [{ $dayOfMonth: '$time' }, 100] }, { $hour: '$time' }] },
          region: "$region",
          teamId: "$source.t",
          championId: "$source.c",
          itemId: "$itemId"
        },
        timesUsed: { $sum: 1 },
        timesWon: { $sum: { $cmp: ["$source.w", false] } }
      }
    },
    {
      $sort: {
        "_id.time": 1,
      }
    },
    {
      $group: {
        _id: {
          region: "$_id.region",
          teamId: "$_id.teamId",
          championId: "$_id.championId",
          itemId: "$_id.itemId",
        },
        times: { $push: "$_id.time" },
        timesUsed: { $push: "$timesUsed" },
        timesWon: { $push: "$timesWon" },
      }
    },
    {
      $sort: {
        "_id.itemId": 1,
      }
    },
    {
      $group: {
        _id: {
          region: "$_id.region",
          teamId: "$_id.teamId",
          championId: "$_id.championId"
        },
        items: { $push: {
          itemId: "$_id.itemId",
          times: "$times",
          timesUsed: "$timesUsed",
          timesWon: "$timesWon"
        } }
      }
    }
    ,
    {
      $out: "ItemWinRatesOverTimeRTC"
    }
  ],
  {
    allowDiskUse: true
  }
);
