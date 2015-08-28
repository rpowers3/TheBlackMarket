//
// This aggregation generates the item win rates collection that
// lets us know how many times and item was purchased and how many
// times the buyer won with that item.
//
// This script does not take into consideration ITEM_UNDO currently
// which will skew the data a little. Hopefully this is not
// substantial enough to affect the data.
//
// The data is formatted in a way to minimize its json representation
// to make it easier to send to a web client as data.
//
// Dependencies:
//   PrepareMatchEvents
//
db.MatchEvents.aggregate(
  [
    {
      $match: {
        "eventType": "ITEM_PURCHASED",
      }
    },
    {
      $group: {
        _id: {
          itemId: "$itemId"
        },
        timesUsed: { $sum: 1 },
        timesWon: { $sum: { $cmp: [ "$source.w", false ] } }
      }
    },
    {
      $group: {
        _id: {
          itemId: "$_id.itemId"
        },
        timesUsed: { $sum: "$timesUsed" },
        timesWon: { $sum: "$timesWon" }
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
          global: "global",
        },
        items: { $push: "$_id.itemId" },
        timesUsed: { $push: "$timesUsed" },
        timesWon: { $push: "$timesWon" },
      }
    }
    ,
    {
      $out: "ItemWinRatesG"
    }
  ],
  {
    allowDiskUse: true
  }
);
