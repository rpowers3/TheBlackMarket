//
// Generate a document store with only the match events data flattened out.
// This is done to make future work on the events data quicker.
//
// This query is extremely slow. It could probably be optimized if some
// assumptions were made about participant ids and team assignments.
//
// Generate a document store with only the match events data flattened out.
// This is done to make future work on the events data quicker.
//
// This query is extremely slow. It could probably be optimized if some
// assumptions were made about participant ids and team assignments.
//
db.Matches.aggregate(
  {
    $unwind: "$timeline.frames"
  },
  {
    $unwind: "$timeline.frames.events"
  },
  {
    $project: {
      matchId: true,
      region: true,
      platformId: true,
      matchCreation: true,
      time: {
        $add: [new Date(0), "$matchCreation", "$timeline.frames.events.timestamp"]
      },
      oneMinuteInterval: {
        $subtract: [
          { $divide: ["$timeline.frames.events.timestamp", 60000] },
          { $mod: [{ $divide: ["$timeline.frames.events.timestamp", 60000] }, 1] }
        ]
      },
      fiveMinuteInterval: {
        $subtract: [
          { $divide: ["$timeline.frames.events.timestamp", 300000] },
          { $mod: [{ $divide: ["$timeline.frames.events.timestamp", 300000] }, 1] }
        ]
      },
      // Hello craziness. I needed the players as selected fields so that I could unpack the
      // participant, creator, killer, and victim ids to have more information that would
      // be useful for future queries. This craziness generates an array with one element that
      // is the targeted player or team. The following unwinds unpack the array so its just
      // the field.
      p1:    { $setDifference: [ { $map: { input: "$participants", as: "participant", in: { $cond: [ { $eq: [ "$$participant.participantId",   1 ] }, "$$participant", null ] } } }, [ null ] ] },
      p2:    { $setDifference: [ { $map: { input: "$participants", as: "participant", in: { $cond: [ { $eq: [ "$$participant.participantId",   2 ] }, "$$participant", null ] } } }, [ null ] ] },
      p3:    { $setDifference: [ { $map: { input: "$participants", as: "participant", in: { $cond: [ { $eq: [ "$$participant.participantId",   3 ] }, "$$participant", null ] } } }, [ null ] ] },
      p4:    { $setDifference: [ { $map: { input: "$participants", as: "participant", in: { $cond: [ { $eq: [ "$$participant.participantId",   4 ] }, "$$participant", null ] } } }, [ null ] ] },
      p5:    { $setDifference: [ { $map: { input: "$participants", as: "participant", in: { $cond: [ { $eq: [ "$$participant.participantId",   5 ] }, "$$participant", null ] } } }, [ null ] ] },
      p6:    { $setDifference: [ { $map: { input: "$participants", as: "participant", in: { $cond: [ { $eq: [ "$$participant.participantId",   6 ] }, "$$participant", null ] } } }, [ null ] ] },
      p7:    { $setDifference: [ { $map: { input: "$participants", as: "participant", in: { $cond: [ { $eq: [ "$$participant.participantId",   7 ] }, "$$participant", null ] } } }, [ null ] ] },
      p8:    { $setDifference: [ { $map: { input: "$participants", as: "participant", in: { $cond: [ { $eq: [ "$$participant.participantId",   8 ] }, "$$participant", null ] } } }, [ null ] ] },
      p9:    { $setDifference: [ { $map: { input: "$participants", as: "participant", in: { $cond: [ { $eq: [ "$$participant.participantId",   9 ] }, "$$participant", null ] } } }, [ null ] ] },
      p10:   { $setDifference: [ { $map: { input: "$participants", as: "participant", in: { $cond: [ { $eq: [ "$$participant.participantId",  10 ] }, "$$participant", null ] } } }, [ null ] ] },
      team1: { $setDifference: [ { $map: { input: "$teams",        as: "team",        in: { $cond: [ { $eq: [ "$$team.teamId",               100 ] }, "$$team",        null ] } } }, [ null ] ] },
      team2: { $setDifference: [ { $map: { input: "$teams",        as: "team",        in: { $cond: [ { $eq: [ "$$team.teamId",               200 ] }, "$$team",        null ] } } }, [ null ] ] },
      event: "$timeline.frames.events",
      sourceId: { $ifNull: [ "$timeline.frames.events.participantId", { $ifNull: ["$timeline.frames.events.creatorId", "$timeline.frames.events.killerId" ] } ] },
      targetId: "$timeline.frames.events.victimId",
    }
  },
  {
    $unwind: "$p1"
  },
  {
    $unwind: "$p2"
  },
  {
    $unwind: "$p3"
  },
  {
    $unwind: "$p4"
  },
  {
    $unwind: "$p5"
  },
  {
    $unwind: "$p6"
  },
  {
    $unwind: "$p7"
  },
  {
    $unwind: "$p8"
  },
  {
    $unwind: "$p9"
  },
  {
    $unwind: "$p10"
  },
  {
    $unwind: "$team1"
  },
  {
    $unwind: "$team2"
  },
  {
    $project: {
      _id: false,
      matchId: true,
      region: true,
      platformId: true,
      matchCreation: true,
      time: true,
      timestamp: "$event.timestamp",
      oneMinuteInterval: true,
      fiveMinuteInterval: true,
      eventType: "$event.eventType",
      source:
        { $cond: [ { $eq: [ "$sourceId",  1 ] }, { p: "$sourceId", w: "$p1.stats.winner",  c: "$p1.championId",  t: "$p1.teamId"  }, 
        { $cond: [ { $eq: [ "$sourceId",  2 ] }, { p: "$sourceId", w: "$p2.stats.winner",  c: "$p2.championId",  t: "$p2.teamId"  }, 
        { $cond: [ { $eq: [ "$sourceId",  3 ] }, { p: "$sourceId", w: "$p3.stats.winner",  c: "$p3.championId",  t: "$p3.teamId"  }, 
        { $cond: [ { $eq: [ "$sourceId",  4 ] }, { p: "$sourceId", w: "$p4.stats.winner",  c: "$p4.championId",  t: "$p4.teamId"  },
        { $cond: [ { $eq: [ "$sourceId",  5 ] }, { p: "$sourceId", w: "$p5.stats.winner",  c: "$p5.championId",  t: "$p5.teamId"  },
        { $cond: [ { $eq: [ "$sourceId",  6 ] }, { p: "$sourceId", w: "$p6.stats.winner",  c: "$p6.championId",  t: "$p6.teamId"  },
        { $cond: [ { $eq: [ "$sourceId",  7 ] }, { p: "$sourceId", w: "$p7.stats.winner",  c: "$p7.championId",  t: "$p7.teamId"  },
        { $cond: [ { $eq: [ "$sourceId",  8 ] }, { p: "$sourceId", w: "$p8.stats.winner",  c: "$p8.championId",  t: "$p8.teamId"  },
        { $cond: [ { $eq: [ "$sourceId",  9 ] }, { p: "$sourceId", w: "$p9.stats.winner",  c: "$p9.championId",  t: "$p9.teamId"  },
        { $cond: [ { $eq: [ "$sourceId", 10 ] }, { p: "$sourceId", w: "$p10.stats.winner", c: "$p10.championId", t: "$p10.teamId" }, null ] } ] } ] } ] } ] } ] } ] } ] } ] } ] },
      target:
        { $cond: [ { $eq: [ "$targetId",  1 ] }, { p: "$targetId", w: "$p1.stats.winner",  c: "$p1.championId",  t: "$p1.teamId"  }, 
        { $cond: [ { $eq: [ "$targetId",  2 ] }, { p: "$targetId", w: "$p2.stats.winner",  c: "$p2.championId",  t: "$p2.teamId"  }, 
        { $cond: [ { $eq: [ "$targetId",  3 ] }, { p: "$targetId", w: "$p3.stats.winner",  c: "$p3.championId",  t: "$p3.teamId"  }, 
        { $cond: [ { $eq: [ "$targetId",  4 ] }, { p: "$targetId", w: "$p4.stats.winner",  c: "$p4.championId",  t: "$p4.teamId"  },
        { $cond: [ { $eq: [ "$targetId",  5 ] }, { p: "$targetId", w: "$p5.stats.winner",  c: "$p5.championId",  t: "$p5.teamId"  },
        { $cond: [ { $eq: [ "$targetId",  6 ] }, { p: "$targetId", w: "$p6.stats.winner",  c: "$p6.championId",  t: "$p6.teamId"  },
        { $cond: [ { $eq: [ "$targetId",  7 ] }, { p: "$targetId", w: "$p7.stats.winner",  c: "$p7.championId",  t: "$p7.teamId"  },
        { $cond: [ { $eq: [ "$targetId",  8 ] }, { p: "$targetId", w: "$p8.stats.winner",  c: "$p8.championId",  t: "$p8.teamId"  },
        { $cond: [ { $eq: [ "$targetId",  9 ] }, { p: "$targetId", w: "$p9.stats.winner",  c: "$p9.championId",  t: "$p9.teamId"  },
        { $cond: [ { $eq: [ "$targetId", 10 ] }, { p: "$targetId", w: "$p10.stats.winner", c: "$p10.championId", t: "$p10.teamId" }, null ] } ] } ] } ] } ] } ] } ] } ] } ] } ] },
      team: { $cond: [
        "$event.teamId",
        {
          t: "$event.teamId",
          w: { $cond: [ { $eq: [ "$event.teamId", 100 ] }, "$team1.winner", 
             { $cond: [ { $eq: [ "$event.teamId", 200 ] }, "$team2.winner",  null ] } ] }
        },
        null
      ] },
      assistingParticipantIds: "$event.assistingParticipantIds",
      buildingType: "$event.buildingType",
      itemAfter: "$event.itemAfter",
      itemBefore: "$event.itemBefore",
      itemId: "$event.itemId",
      laneType: "$event.laneType",
      levelUpType: "$event.levelUpType",
      monsterType: "$event.monsterType",
      position: "$event.position",
      skillSlot: "$event.skillSlot",
      towerType: "$event.towerType",
      wardType: "$event.wardType"
    }
  },
  {
    $out: "MatchEvents"
  }
);

// Generate indices to assist performing queries.
db.MatchEvents.createIndex({ matchId: 1 });
db.MatchEvents.createIndex({ region: 1 });
db.MatchEvents.createIndex({ matchCreation: 1 });
db.MatchEvents.createIndex({ time: 1 });
db.MatchEvents.createIndex({ eventType: 1 });
db.MatchEvents.createIndex({ itemId: 1 });
