//
// Calculates the per minute purchase and win count for items in games.
// This aims to show trends related to the game time purchase of an item
// and how this correlates to wins.
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
          championId: "$source.c",
          itemId: "$itemId",
          oneMinuteInterval: "$oneMinuteInterval"
        },
        bought: { $sum: 1 },
        timesWon: { $sum: { $cmp: ["$source.w", false] } }
      }
    },
    {
      $sort: {
        "_id.oneMinuteInterval": 1
      }
    },
    {
      $group: {
        _id: {
          championId: "$_id.championId",
          itemId: "$_id.itemId",
        },
        times: { $push: "$_id.oneMinuteInterval" },
        bought: { $push: "$bought" },
        timesWon: { $push: "$timesWon" },
      }
    },
    {
      $out: "ItemPerMinuteWinRatesCI"
    }
  ],
  {
    allowDiskUse: true
  }
);
