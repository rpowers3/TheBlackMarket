//
// Dependencies:
//   PrepareMatchEvents
//
db.MatchEvents.aggregate(
  [
    {
      $match: {
        eventType: "BUILDING_KILL"
      }
    },
    {
      $group: {
        _id: {
          laneType: "$laneType",
          towerType: "$towerType"
        },
        count: { $sum: 1 },
        timesWon: { $sum: { $cmp: [ { $ifNull: [ "$source.w", { $not: "$team.w" } ] }, false ] } }
      }
    },
    {
      $sort: {
        "_id.laneType": 1,
        "_id.towerType": 1,
      }
    },
    {
      $group: {
        _id: {
          global: "global"
        },
        laneTypes: { $push: "$_id.laneType" },
        towerTypes: { $push: "$_id.towerType" },
        count: { $push: "$count" },
        timesWon: { $push: "$timesWon" }
      }
    }
    ,
    {
      $out: "BuildingKillG"
    }
  ],
  {
    allowDiskUse: true
  }
);
