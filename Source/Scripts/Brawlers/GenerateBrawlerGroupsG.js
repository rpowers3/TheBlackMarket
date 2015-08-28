//
// Dependencies:
//   PrepareMatchEvents
//
db.MatchEvents.aggregate(
  [
    {
      $match: {
        eventType: "ITEM_PURCHASED",
        itemId: { $in: [3611, 3612, 3613, 3614] }
      }
    },
    {
      $sort: {
        itemId: 1
      }
    },
    {
      $group: {
        _id: {
          matchId: "$matchId",
          teamWin: "$source.w",
        },
        brawlers: { $push: "$itemId" },
      }
    },
    {
      $group: {
        _id: {
          brawlers: "$brawlers"
        },
        count: { $sum: 1 },
        timesWon: { $sum: { $cmp: ["$_id.teamWin", false] } }
      }
    },
    {
      $sort: {
        count: -1
      }
    },
    {
      $group: {
        _id: {
          global: "global"
        },
        brawlerGroups: {
          $push: {
            brawlers: "$_id.brawlers",
            count: "$count",
            timesWon: "$timesWon"
          }
        }
      }
    }
    ,
    {
      $out: "BrawlerGroupsG"
    }
  ],
  {
    allowDiskUse: true
  }
);
