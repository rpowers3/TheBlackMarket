
//
// Dependencies:
//   GenerateMatchParticipants
//
db.MatchParticipants.aggregate(
  [
    {
      $project: {
        _id: false,
        matchId: true,
        region: true,
        platformId: true,
        matchCreation: true,
        matchDuration: true,
        matchVersion: true,
        teamId: true,
        participantId: true,
        spell1Id: true,
        spell2Id: true,
        championId: true,
        highestAchievedSeasonTier: true,
        masteries: true,
        runes: true,
        stats: true,
        champLevelWin: { $cond: ['$stats.winner', '$stats.champLevel', null] },
        killsWin: { $cond: ['$stats.winner', '$stats.kills', null] },
        doubleKillsWin: { $cond: ['$stats.winner', '$stats.doubleKills', null] },
        tripleKillsWin: { $cond: ['$stats.winner', '$stats.tripleKills', null] },
        quadraKillsWin: { $cond: ['$stats.winner', '$stats.quadraKills', null] },
        pentaKillsWin: { $cond: ['$stats.winner', '$stats.pentaKills', null] },
        unrealKillsWin: { $cond: ['$stats.winner', '$stats.unrealKills', null] },
        largestKillingSpreeWin: { $cond: ['$stats.winner', '$stats.largestKillingSpree', null] },
        deathsWin: { $cond: ['$stats.winner', '$stats.deaths', null] },
        assistsWin: { $cond: ['$stats.winner', '$stats.assists', null] },
        totalDamageDealtWin: { $cond: ['$stats.winner', '$stats.totalDamageDealt', null] },
        totalDamageDealtToChampionsWin: { $cond: ['$stats.winner', '$stats.totalDamageDealtToChampions', null] },
        totalDamageTakenWin: { $cond: ['$stats.winner', '$stats.totalDamageTaken', null] },
        largestCriticalStrikeWin: { $cond: ['$stats.winner', '$stats.largestCriticalStrike', null] },
        totalHealWin: { $cond: ['$stats.winner', '$stats.totalHeal', null] },
        minionsKilledWin: { $cond: ['$stats.winner', '$stats.minionsKilled', null] },
        neutralMinionsKilledWin: { $cond: ['$stats.winner', '$stats.neutralMinionsKilled', null] },
        neutralMinionsKilledTeamJungleWin: { $cond: ['$stats.winner', '$stats.neutralMinionsKilledTeamJungle', null] },
        neutralMinionsKilledEnemyJungleWin: { $cond: ['$stats.winner', '$stats.neutralMinionsKilledEnemyJungle', null] },
        goldEarnedWin: { $cond: ['$stats.winner', '$stats.goldEarned', null] },
        goldSpentWin: { $cond: ['$stats.winner', '$stats.goldSpent', null] },
        magicDamageDealtToChampionsWin: { $cond: ['$stats.winner', '$stats.magicDamageDealtToChampions', null] },
        physicalDamageDealtToChampionsWin: { $cond: ['$stats.winner', '$stats.physicalDamageDealtToChampions', null] },
        trueDamageDealtToChampionsWin: { $cond: ['$stats.winner', '$stats.trueDamageDealtToChampions', null] },
        visionWardsBoughtInGameWin: { $cond: ['$stats.winner', '$stats.visionWardsBoughtInGame', null] },
        sightWardsBoughtInGameWin: { $cond: ['$stats.winner', '$stats.sightWardsBoughtInGame', null] },
        magicDamageDealtWin: { $cond: ['$stats.winner', '$stats.magicDamageDealt', null] },
        physicalDamageDealtWin: { $cond: ['$stats.winner', '$stats.physicalDamageDealt', null] },
        trueDamageDealtWin: { $cond: ['$stats.winner', '$stats.trueDamageDealt', null] },
        magicDamageTakenWin: { $cond: ['$stats.winner', '$stats.magicDamageTaken', null] },
        physicalDamageTakenWin: { $cond: ['$stats.winner', '$stats.physicalDamageTaken', null] },
        firstBloodKillWin: { $cond: ['$stats.winner', { $cmp: ['$stats.firstBloodKill', false] }, null] },
        firstBloodAssistWin: { $cond: ['$stats.winner', { $cmp: ['$stats.firstBloodAssist', false] }, null] },
        firstTowerKillWin: { $cond: ['$stats.winner', { $cmp: ['$stats.firstTowerKill', false] }, null] },
        firstTowerAssistWin: { $cond: ['$stats.winner', { $cmp: ['$stats.firstTowerAssist', false] }, null] },
        firstInhibitorKillWin: { $cond: ['$stats.winner', { $cmp: ['$stats.firstInhibitorKill', false] }, null] },
        firstInhibitorAssistWin: { $cond: ['$stats.winner', { $cmp: ['$stats.firstInhibitorAssist', false] }, null] },
        inhibitorKillsWin: { $cond: ['$stats.winner', '$stats.inhibitorKills', null] },
        towerKillsWin: { $cond: ['$stats.winner', '$stats.towerKills', null] },
        wardsPlacedWin: { $cond: ['$stats.winner', '$stats.wardsPlaced', null] },
        wardsKilledWin: { $cond: ['$stats.winner', '$stats.wardsKilled', null] },
        largestMultiKillWin: { $cond: ['$stats.winner', '$stats.largestMultiKill', null] },
        killingSpreesWin: { $cond: ['$stats.winner', '$stats.killingSprees', null] },
        totalUnitsHealedWin: { $cond: ['$stats.winner', '$stats.totalUnitsHealed', null] },
        totalTimeCrowdControlDealtWin: { $cond: ['$stats.winner', '$stats.totalTimeCrowdControlDealt', null] }
      }
    },
    {
      $group: {
        _id: {
          region: '$region'
        },
        timesPlayed: { $sum: 1 },
        wins: { $sum: { $cmp: ['$stats.winner', false] } },
        champLevelMin: { $min: '$stats.champLevel' },
        champLevelAvg: { $avg: '$stats.champLevel' },
        champLevelMax: { $max: '$stats.champLevel' },
        champLevelMinWin: { $min: '$champLevelWin' },
        champLevelAvgWin: { $avg: '$champLevelWin' },
        champLevelMaxWin: { $max: '$champLevelWin' },
        killsMin: { $min: '$stats.kills' },
        killsAvg: { $avg: '$stats.kills' },
        killsMax: { $max: '$stats.kills' },
        killsSum: { $sum: '$stats.kills' },
        killsMinWin: { $min: '$killsWin' },
        killsAvgWin: { $avg: '$killsWin' },
        killsMaxWin: { $max: '$killsWin' },
        killsSumWin: { $sum: '$killsWin' },
        doubleKillsMin: { $min: '$stats.doubleKills' },
        doubleKillsAvg: { $avg: '$stats.doubleKills' },
        doubleKillsMax: { $max: '$stats.doubleKills' },
        doubleKillsSum: { $sum: '$stats.doubleKills' },
        doubleKillsMinWin: { $min: '$doubleKillsWin' },
        doubleKillsAvgWin: { $avg: '$doubleKillsWin' },
        doubleKillsMaxWin: { $max: '$doubleKillsWin' },
        doubleKillsSumWin: { $sum: '$doubleKillsWin' },
        tripleKillsMin: { $min: '$stats.tripleKills' },
        tripleKillsAvg: { $avg: '$stats.tripleKills' },
        tripleKillsMax: { $max: '$stats.tripleKills' },
        tripleKillsSum: { $sum: '$stats.tripleKills' },
        tripleKillsMinWin: { $min: '$tripleKillsWin' },
        tripleKillsAvgWin: { $avg: '$tripleKillsWin' },
        tripleKillsMaxWin: { $max: '$tripleKillsWin' },
        tripleKillsSumWin: { $sum: '$tripleKillsWin' },
        quadraKillsMin: { $min: '$stats.quadraKills' },
        quadraKillsAvg: { $avg: '$stats.quadraKills' },
        quadraKillsMax: { $max: '$stats.quadraKills' },
        quadraKillsSum: { $sum: '$stats.quadraKills' },
        quadraKillsMinWin: { $min: '$quadraKillsWin' },
        quadraKillsAvgWin: { $avg: '$quadraKillsWin' },
        quadraKillsMaxWin: { $max: '$quadraKillsWin' },
        quadraKillsSumWin: { $sum: '$quadraKillsWin' },
        pentaKillsMin: { $min: '$stats.pentaKills' },
        pentaKillsAvg: { $avg: '$stats.pentaKills' },
        pentaKillsMax: { $max: '$stats.pentaKills' },
        pentaKillsSum: { $sum: '$stats.pentaKills' },
        pentaKillsMinWin: { $min: '$pentaKillsWin' },
        pentaKillsAvgWin: { $avg: '$pentaKillsWin' },
        pentaKillsMaxWin: { $max: '$pentaKillsWin' },
        pentaKillsSumWin: { $sum: '$pentaKillsWin' },
        unrealKillsMin: { $min: '$stats.unrealKills' },
        unrealKillsAvg: { $avg: '$stats.unrealKills' },
        unrealKillsMax: { $max: '$stats.unrealKills' },
        unrealKillsSum: { $sum: '$stats.unrealKills' },
        unrealKillsMinWin: { $min: '$unrealKillsWin' },
        unrealKillsAvgWin: { $avg: '$unrealKillsWin' },
        unrealKillsMaxWin: { $max: '$unrealKillsWin' },
        unrealKillsSumWin: { $sum: '$unrealKillsWin' },
        largestKillingSpreeMin: { $min: '$stats.largestKillingSpree' },
        largestKillingSpreeAvg: { $avg: '$stats.largestKillingSpree' },
        largestKillingSpreeMax: { $max: '$stats.largestKillingSpree' },
        largestKillingSpreeSum: { $sum: '$stats.largestKillingSpree' },
        largestKillingSpreeMinWin: { $min: '$largestKillingSpreeWin' },
        largestKillingSpreeAvgWin: { $avg: '$largestKillingSpreeWin' },
        largestKillingSpreeMaxWin: { $max: '$largestKillingSpreeWin' },
        largestKillingSpreeSumWin: { $sum: '$largestKillingSpreeWin' },
        deathsMin: { $min: '$stats.deaths' },
        deathsAvg: { $avg: '$stats.deaths' },
        deathsMax: { $max: '$stats.deaths' },
        deathsSum: { $sum: '$stats.deaths' },
        deathsMinWin: { $min: '$deathsWin' },
        deathsAvgWin: { $avg: '$deathsWin' },
        deathsMaxWin: { $max: '$deathsWin' },
        deathsSumWin: { $sum: '$deathsWin' },
        assistsMin: { $min: '$stats.assists' },
        assistsAvg: { $avg: '$stats.assists' },
        assistsMax: { $max: '$stats.assists' },
        assistsSum: { $sum: '$stats.assists' },
        assistsMinWin: { $min: '$assistsWin' },
        assistsAvgWin: { $avg: '$assistsWin' },
        assistsMaxWin: { $max: '$assistsWin' },
        assistsSumWin: { $sum: '$assistsWin' },
        totalDamageDealtMin: { $min: '$stats.totalDamageDealt' },
        totalDamageDealtAvg: { $avg: '$stats.totalDamageDealt' },
        totalDamageDealtMax: { $max: '$stats.totalDamageDealt' },
        totalDamageDealtSum: { $sum: '$stats.totalDamageDealt' },
        totalDamageDealtMinWin: { $min: '$totalDamageDealtWin' },
        totalDamageDealtAvgWin: { $avg: '$totalDamageDealtWin' },
        totalDamageDealtMaxWin: { $max: '$totalDamageDealtWin' },
        totalDamageDealtSumWin: { $sum: '$totalDamageDealtWin' },
        totalDamageDealtToChampionsMin: { $min: '$stats.totalDamageDealtToChampions' },
        totalDamageDealtToChampionsAvg: { $avg: '$stats.totalDamageDealtToChampions' },
        totalDamageDealtToChampionsMax: { $max: '$stats.totalDamageDealtToChampions' },
        totalDamageDealtToChampionsSum: { $sum: '$stats.totalDamageDealtToChampions' },
        totalDamageDealtToChampionsMinWin: { $min: '$totalDamageDealtToChampionsWin' },
        totalDamageDealtToChampionsAvgWin: { $avg: '$totalDamageDealtToChampionsWin' },
        totalDamageDealtToChampionsMaxWin: { $max: '$totalDamageDealtToChampionsWin' },
        totalDamageDealtToChampionsSumWin: { $sum: '$totalDamageDealtToChampionsWin' },
        totalDamageTakenMin: { $min: '$stats.totalDamageTaken' },
        totalDamageTakenAvg: { $avg: '$stats.totalDamageTaken' },
        totalDamageTakenMax: { $max: '$stats.totalDamageTaken' },
        totalDamageTakenSum: { $sum: '$stats.totalDamageTaken' },
        totalDamageTakenMinWin: { $min: '$totalDamageTakenWin' },
        totalDamageTakenAvgWin: { $avg: '$totalDamageTakenWin' },
        totalDamageTakenMaxWin: { $max: '$totalDamageTakenWin' },
        totalDamageTakenSumWin: { $sum: '$totalDamageTakenWin' },
        largestCriticalStrikeMin: { $min: '$stats.largestCriticalStrike' },
        largestCriticalStrikeAvg: { $avg: '$stats.largestCriticalStrike' },
        largestCriticalStrikeMax: { $max: '$stats.largestCriticalStrike' },
        largestCriticalStrikeSum: { $sum: '$stats.largestCriticalStrike' },
        largestCriticalStrikeMinWin: { $min: '$largestCriticalStrikeWin' },
        largestCriticalStrikeAvgWin: { $avg: '$largestCriticalStrikeWin' },
        largestCriticalStrikeMaxWin: { $max: '$largestCriticalStrikeWin' },
        largestCriticalStrikeSumWin: { $sum: '$largestCriticalStrikeWin' },
        totalHealMin: { $min: '$stats.totalHeal' },
        totalHealAvg: { $avg: '$stats.totalHeal' },
        totalHealMax: { $max: '$stats.totalHeal' },
        totalHealSum: { $sum: '$stats.totalHeal' },
        totalHealMinWin: { $min: '$totalHealWin' },
        totalHealAvgWin: { $avg: '$totalHealWin' },
        totalHealMaxWin: { $max: '$totalHealWin' },
        totalHealSumWin: { $sum: '$totalHealWin' },
        minionsKilledMin: { $min: '$stats.minionsKilled' },
        minionsKilledAvg: { $avg: '$stats.minionsKilled' },
        minionsKilledMax: { $max: '$stats.minionsKilled' },
        minionsKilledSum: { $sum: '$stats.minionsKilled' },
        minionsKilledMinWin: { $min: '$minionsKilledWin' },
        minionsKilledAvgWin: { $avg: '$minionsKilledWin' },
        minionsKilledMaxWin: { $max: '$minionsKilledWin' },
        minionsKilledSumWin: { $sum: '$minionsKilledWin' },
        neutralMinionsKilledMin: { $min: '$stats.neutralMinionsKilled' },
        neutralMinionsKilledAvg: { $avg: '$stats.neutralMinionsKilled' },
        neutralMinionsKilledMax: { $max: '$stats.neutralMinionsKilled' },
        neutralMinionsKilledSum: { $sum: '$stats.neutralMinionsKilled' },
        neutralMinionsKilledMinWin: { $min: '$neutralMinionsKilledWin' },
        neutralMinionsKilledAvgWin: { $avg: '$neutralMinionsKilledWin' },
        neutralMinionsKilledMaxWin: { $max: '$neutralMinionsKilledWin' },
        neutralMinionsKilledSumWin: { $sum: '$neutralMinionsKilledWin' },
        neutralMinionsKilledTeamJungleMin: { $min: '$stats.neutralMinionsKilledTeamJungle' },
        neutralMinionsKilledTeamJungleAvg: { $avg: '$stats.neutralMinionsKilledTeamJungle' },
        neutralMinionsKilledTeamJungleMax: { $max: '$stats.neutralMinionsKilledTeamJungle' },
        neutralMinionsKilledTeamJungleSum: { $sum: '$stats.neutralMinionsKilledTeamJungle' },
        neutralMinionsKilledTeamJungleMinWin: { $min: '$neutralMinionsKilledTeamJungleWin' },
        neutralMinionsKilledTeamJungleAvgWin: { $avg: '$neutralMinionsKilledTeamJungleWin' },
        neutralMinionsKilledTeamJungleMaxWin: { $max: '$neutralMinionsKilledTeamJungleWin' },
        neutralMinionsKilledTeamJungleSumWin: { $sum: '$neutralMinionsKilledTeamJungleWin' },
        neutralMinionsKilledEnemyJungleMin: { $min: '$stats.neutralMinionsKilledEnemyJungle' },
        neutralMinionsKilledEnemyJungleAvg: { $avg: '$stats.neutralMinionsKilledEnemyJungle' },
        neutralMinionsKilledEnemyJungleMax: { $max: '$stats.neutralMinionsKilledEnemyJungle' },
        neutralMinionsKilledEnemyJungleSum: { $sum: '$stats.neutralMinionsKilledEnemyJungle' },
        neutralMinionsKilledEnemyJungleMinWin: { $min: '$neutralMinionsKilledEnemyJungleWin' },
        neutralMinionsKilledEnemyJungleAvgWin: { $avg: '$neutralMinionsKilledEnemyJungleWin' },
        neutralMinionsKilledEnemyJungleMaxWin: { $max: '$neutralMinionsKilledEnemyJungleWin' },
        neutralMinionsKilledEnemyJungleSumWin: { $sum: '$neutralMinionsKilledEnemyJungleWin' },
        goldEarnedMin: { $min: '$stats.goldEarned' },
        goldEarnedAvg: { $avg: '$stats.goldEarned' },
        goldEarnedMax: { $max: '$stats.goldEarned' },
        goldEarnedSum: { $sum: '$stats.goldEarned' },
        goldEarnedMinWin: { $min: '$goldEarnedWin' },
        goldEarnedAvgWin: { $avg: '$goldEarnedWin' },
        goldEarnedMaxWin: { $max: '$goldEarnedWin' },
        goldEarnedSumWin: { $sum: '$goldEarnedWin' },
        goldSpentMin: { $min: '$stats.goldSpent' },
        goldSpentAvg: { $avg: '$stats.goldSpent' },
        goldSpentMax: { $max: '$stats.goldSpent' },
        goldSpentSum: { $sum: '$stats.goldSpent' },
        goldSpentMinWin: { $min: '$goldSpentWin' },
        goldSpentAvgWin: { $avg: '$goldSpentWin' },
        goldSpentMaxWin: { $max: '$goldSpentWin' },
        goldSpentSumWin: { $sum: '$goldSpentWin' },
        magicDamageDealtToChampionsMin: { $min: '$stats.magicDamageDealtToChampions' },
        magicDamageDealtToChampionsAvg: { $avg: '$stats.magicDamageDealtToChampions' },
        magicDamageDealtToChampionsMax: { $max: '$stats.magicDamageDealtToChampions' },
        magicDamageDealtToChampionsSum: { $sum: '$stats.magicDamageDealtToChampions' },
        magicDamageDealtToChampionsMinWin: { $min: '$magicDamageDealtToChampionsWin' },
        magicDamageDealtToChampionsAvgWin: { $avg: '$magicDamageDealtToChampionsWin' },
        magicDamageDealtToChampionsMaxWin: { $max: '$magicDamageDealtToChampionsWin' },
        magicDamageDealtToChampionsSumWin: { $sum: '$magicDamageDealtToChampionsWin' },
        physicalDamageDealtToChampionsMin: { $min: '$stats.physicalDamageDealtToChampions' },
        physicalDamageDealtToChampionsAvg: { $avg: '$stats.physicalDamageDealtToChampions' },
        physicalDamageDealtToChampionsMax: { $max: '$stats.physicalDamageDealtToChampions' },
        physicalDamageDealtToChampionsSum: { $sum: '$stats.physicalDamageDealtToChampions' },
        physicalDamageDealtToChampionsMinWin: { $min: '$physicalDamageDealtToChampionsWin' },
        physicalDamageDealtToChampionsAvgWin: { $avg: '$physicalDamageDealtToChampionsWin' },
        physicalDamageDealtToChampionsMaxWin: { $max: '$physicalDamageDealtToChampionsWin' },
        physicalDamageDealtToChampionsSumWin: { $sum: '$physicalDamageDealtToChampionsWin' },
        trueDamageDealtToChampionsMin: { $min: '$stats.trueDamageDealtToChampions' },
        trueDamageDealtToChampionsAvg: { $avg: '$stats.trueDamageDealtToChampions' },
        trueDamageDealtToChampionsMax: { $max: '$stats.trueDamageDealtToChampions' },
        trueDamageDealtToChampionsSum: { $sum: '$stats.trueDamageDealtToChampions' },
        trueDamageDealtToChampionsMinWin: { $min: '$trueDamageDealtToChampionsWin' },
        trueDamageDealtToChampionsAvgWin: { $avg: '$trueDamageDealtToChampionsWin' },
        trueDamageDealtToChampionsMaxWin: { $max: '$trueDamageDealtToChampionsWin' },
        trueDamageDealtToChampionsSumWin: { $sum: '$trueDamageDealtToChampionsWin' },
        visionWardsBoughtInGameMin: { $min: '$stats.visionWardsBoughtInGame' },
        visionWardsBoughtInGameAvg: { $avg: '$stats.visionWardsBoughtInGame' },
        visionWardsBoughtInGameMax: { $max: '$stats.visionWardsBoughtInGame' },
        visionWardsBoughtInGameSum: { $sum: '$stats.visionWardsBoughtInGame' },
        visionWardsBoughtInGameMinWin: { $min: '$visionWardsBoughtInGameWin' },
        visionWardsBoughtInGameAvgWin: { $avg: '$visionWardsBoughtInGameWin' },
        visionWardsBoughtInGameMaxWin: { $max: '$visionWardsBoughtInGameWin' },
        visionWardsBoughtInGameSumWin: { $sum: '$visionWardsBoughtInGameWin' },
        sightWardsBoughtInGameMin: { $min: '$stats.sightWardsBoughtInGame' },
        sightWardsBoughtInGameAvg: { $avg: '$stats.sightWardsBoughtInGame' },
        sightWardsBoughtInGameMax: { $max: '$stats.sightWardsBoughtInGame' },
        sightWardsBoughtInGameSum: { $sum: '$stats.sightWardsBoughtInGame' },
        sightWardsBoughtInGameMinWin: { $min: '$sightWardsBoughtInGameWin' },
        sightWardsBoughtInGameAvgWin: { $avg: '$sightWardsBoughtInGameWin' },
        sightWardsBoughtInGameMaxWin: { $max: '$sightWardsBoughtInGameWin' },
        sightWardsBoughtInGameSumWin: { $sum: '$sightWardsBoughtInGameWin' },
        magicDamageDealtMin: { $min: '$stats.magicDamageDealt' },
        magicDamageDealtAvg: { $avg: '$stats.magicDamageDealt' },
        magicDamageDealtMax: { $max: '$stats.magicDamageDealt' },
        magicDamageDealtSum: { $sum: '$stats.magicDamageDealt' },
        magicDamageDealtMinWin: { $min: '$magicDamageDealtWin' },
        magicDamageDealtAvgWin: { $avg: '$magicDamageDealtWin' },
        magicDamageDealtMaxWin: { $max: '$magicDamageDealtWin' },
        magicDamageDealtSumWin: { $sum: '$magicDamageDealtWin' },
        physicalDamageDealtMin: { $min: '$stats.physicalDamageDealt' },
        physicalDamageDealtAvg: { $avg: '$stats.physicalDamageDealt' },
        physicalDamageDealtMax: { $max: '$stats.physicalDamageDealt' },
        physicalDamageDealtSum: { $sum: '$stats.physicalDamageDealt' },
        physicalDamageDealtMinWin: { $min: '$physicalDamageDealtWin' },
        physicalDamageDealtAvgWin: { $avg: '$physicalDamageDealtWin' },
        physicalDamageDealtMaxWin: { $max: '$physicalDamageDealtWin' },
        physicalDamageDealtSumWin: { $sum: '$physicalDamageDealtWin' },
        trueDamageDealtMin: { $min: '$stats.trueDamageDealt' },
        trueDamageDealtAvg: { $avg: '$stats.trueDamageDealt' },
        trueDamageDealtMax: { $max: '$stats.trueDamageDealt' },
        trueDamageDealtSum: { $sum: '$stats.trueDamageDealt' },
        trueDamageDealtMinWin: { $min: '$trueDamageDealtWin' },
        trueDamageDealtAvgWin: { $avg: '$trueDamageDealtWin' },
        trueDamageDealtMaxWin: { $max: '$trueDamageDealtWin' },
        trueDamageDealtSumWin: { $sum: '$trueDamageDealtWin' },
        magicDamageTakenMin: { $min: '$stats.magicDamageTaken' },
        magicDamageTakenAvg: { $avg: '$stats.magicDamageTaken' },
        magicDamageTakenMax: { $max: '$stats.magicDamageTaken' },
        magicDamageTakenSum: { $sum: '$stats.magicDamageTaken' },
        magicDamageTakenMinWin: { $min: '$magicDamageTakenWin' },
        magicDamageTakenAvgWin: { $avg: '$magicDamageTakenWin' },
        magicDamageTakenMaxWin: { $max: '$magicDamageTakenWin' },
        magicDamageTakenSumWin: { $sum: '$magicDamageTakenWin' },
        physicalDamageTakenMin: { $min: '$stats.physicalDamageTaken' },
        physicalDamageTakenAvg: { $avg: '$stats.physicalDamageTaken' },
        physicalDamageTakenMax: { $max: '$stats.physicalDamageTaken' },
        physicalDamageTakenSum: { $sum: '$stats.physicalDamageTaken' },
        physicalDamageTakenMinWin: { $min: '$physicalDamageTakenWin' },
        physicalDamageTakenAvgWin: { $avg: '$physicalDamageTakenWin' },
        physicalDamageTakenMaxWin: { $max: '$physicalDamageTakenWin' },
        physicalDamageTakenSumWin: { $sum: '$physicalDamageTakenWin' },
        firstBloodKillSum: { $sum: { $cmp: ['$stats.firstBloodKill', false] } },
        firstBloodKillSumWin: { $sum: '$firstBloodKillWin' },
        firstBloodAssistSum: { $sum: { $cmp: ['$stats.firstBloodAssist', false] } },
        firstBloodAssistSumWin: { $sum: '$firstBloodAssistWin' },
        firstTowerKillSum: { $sum: { $cmp: ['$stats.firstTowerKill', false] } },
        firstTowerKillSumWin: { $sum: '$firstTowerKillWin' },
        firstTowerAssistSum: { $sum: { $cmp: ['$stats.firstTowerAssist', false] } },
        firstTowerAssistSumWin: { $sum: '$firstTowerAssistWin' },
        firstInhibitorKillSum: { $sum: { $cmp: ['$stats.firstInhibitorKill', false] } },
        firstInhibitorKillSumWin: { $sum: '$firstInhibitorKillWin' },
        firstInhibitorAssistSum: { $sum: { $cmp: ['$stats.firstInhibitorAssist', false] } },
        firstInhibitorAssistSumWin: { $sum: '$firstInhibitorAssistWin' },
        inhibitorKillsMin: { $min: '$stats.inhibitorKills' },
        inhibitorKillsAvg: { $avg: '$stats.inhibitorKills' },
        inhibitorKillsMax: { $max: '$stats.inhibitorKills' },
        inhibitorKillsSum: { $sum: '$stats.inhibitorKills' },
        inhibitorKillsMinWin: { $min: '$inhibitorKillsWin' },
        inhibitorKillsAvgWin: { $avg: '$inhibitorKillsWin' },
        inhibitorKillsMaxWin: { $max: '$inhibitorKillsWin' },
        inhibitorKillsSumWin: { $sum: '$inhibitorKillsWin' },
        towerKillsMin: { $min: '$stats.towerKills' },
        towerKillsAvg: { $avg: '$stats.towerKills' },
        towerKillsMax: { $max: '$stats.towerKills' },
        towerKillsSum: { $sum: '$stats.towerKills' },
        towerKillsMinWin: { $min: '$towerKillsWin' },
        towerKillsAvgWin: { $avg: '$towerKillsWin' },
        towerKillsMaxWin: { $max: '$towerKillsWin' },
        towerKillsSumWin: { $sum: '$towerKillsWin' },
        wardsPlacedMin: { $min: '$stats.wardsPlaced' },
        wardsPlacedAvg: { $avg: '$stats.wardsPlaced' },
        wardsPlacedMax: { $max: '$stats.wardsPlaced' },
        wardsPlacedSum: { $sum: '$stats.wardsPlaced' },
        wardsPlacedMinWin: { $min: '$wardsPlacedWin' },
        wardsPlacedAvgWin: { $avg: '$wardsPlacedWin' },
        wardsPlacedMaxWin: { $max: '$wardsPlacedWin' },
        wardsPlacedSumWin: { $sum: '$wardsPlacedWin' },
        wardsKilledMin: { $min: '$stats.wardsKilled' },
        wardsKilledAvg: { $avg: '$stats.wardsKilled' },
        wardsKilledMax: { $max: '$stats.wardsKilled' },
        wardsKilledSum: { $sum: '$stats.wardsKilled' },
        wardsKilledMinWin: { $min: '$wardsKilledWin' },
        wardsKilledAvgWin: { $avg: '$wardsKilledWin' },
        wardsKilledMaxWin: { $max: '$wardsKilledWin' },
        wardsKilledSumWin: { $sum: '$wardsKilledWin' },
        largestMultiKillMin: { $min: '$stats.largestMultiKill' },
        largestMultiKillAvg: { $avg: '$stats.largestMultiKill' },
        largestMultiKillMax: { $max: '$stats.largestMultiKill' },
        largestMultiKillSum: { $sum: '$stats.largestMultiKill' },
        largestMultiKillMinWin: { $min: '$largestMultiKillWin' },
        largestMultiKillAvgWin: { $avg: '$largestMultiKillWin' },
        largestMultiKillMaxWin: { $max: '$largestMultiKillWin' },
        largestMultiKillSumWin: { $sum: '$largestMultiKillWin' },
        killingSpreesMin: { $min: '$stats.killingSprees' },
        killingSpreesAvg: { $avg: '$stats.killingSprees' },
        killingSpreesMax: { $max: '$stats.killingSprees' },
        killingSpreesSum: { $sum: '$stats.killingSprees' },
        killingSpreesMinWin: { $min: '$killingSpreesWin' },
        killingSpreesAvgWin: { $avg: '$killingSpreesWin' },
        killingSpreesMaxWin: { $max: '$killingSpreesWin' },
        killingSpreesSumWin: { $sum: '$killingSpreesWin' },
        totalUnitsHealedMin: { $min: '$stats.totalUnitsHealed' },
        totalUnitsHealedAvg: { $avg: '$stats.totalUnitsHealed' },
        totalUnitsHealedMax: { $max: '$stats.totalUnitsHealed' },
        totalUnitsHealedSum: { $sum: '$stats.totalUnitsHealed' },
        totalUnitsHealedMinWin: { $min: '$totalUnitsHealedWin' },
        totalUnitsHealedAvgWin: { $avg: '$totalUnitsHealedWin' },
        totalUnitsHealedMaxWin: { $max: '$totalUnitsHealedWin' },
        totalUnitsHealedSumWin: { $sum: '$totalUnitsHealedWin' },
        totalTimeCrowdControlDealtMin: { $min: '$stats.totalTimeCrowdControlDealt' },
        totalTimeCrowdControlDealtAvg: { $avg: '$stats.totalTimeCrowdControlDealt' },
        totalTimeCrowdControlDealtMax: { $max: '$stats.totalTimeCrowdControlDealt' },
        totalTimeCrowdControlDealtSum: { $sum: '$stats.totalTimeCrowdControlDealt' },
        totalTimeCrowdControlDealtMinWin: { $min: '$totalTimeCrowdControlDealtWin' },
        totalTimeCrowdControlDealtAvgWin: { $avg: '$totalTimeCrowdControlDealtWin' },
        totalTimeCrowdControlDealtMaxWin: { $max: '$totalTimeCrowdControlDealtWin' },
        totalTimeCrowdControlDealtSumWin: { $sum: '$totalTimeCrowdControlDealtWin' }
      }
    }
    ,
    {
      $out: 'ChampionStatsR'
    }
  ],
  {
    allowDiskUse: true
  }
);
