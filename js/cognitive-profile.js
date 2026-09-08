/*
 * NEUROSAATHI
 * COGNITIVE ACTIVITY PROFILE
 *
 * Combines performance from different activities
 * into a simple caregiver-friendly profile.
 *
 * IMPORTANT:
 * This is NOT a medical diagnosis.
 * It only summarizes activity performance.
 */

const NeuroSaathiCognitiveProfile = {

  RECENT_SESSIONS: 5,


  /*
   * Game → Cognitive activity domain
   */

  GAME_DOMAINS: {

      "Memory Match":
          "Memory & Recall",

      "sorting-matching":
          "Sorting & Thinking",

      "relationship-match":
          "Association & Recognition",

      "guided-yoga-focus":
          "Attention & Focus"

  },


  /*
   * Get sessions for a game.
   */

  getGameSessions: function(gameName) {

      if (
          typeof NeuroSaathiPerformance ===
          "undefined"
      ) {

          return [];

      }

      return NeuroSaathiPerformance
          .getGameData(gameName);

  },


  /*
   * Calculate average accuracy.
   */

  calculateAverageAccuracy:
      function(sessions) {

          if (
              !sessions ||
              sessions.length === 0
          ) {

              return 0;

          }


          let total = 0;


          sessions.forEach(
              function(session) {

                  total +=
                      Number(
                          session.accuracy
                      ) || 0;

              }
          );


          return Math.round(
              total /
              sessions.length
          );

      },


  /*
   * Calculate recent improvement.
   */

  calculateImprovement:
      function(sessions) {

          if (
              !sessions ||
              sessions.length < 2
          ) {

              return 0;

          }


          const previous =
              Number(
                  sessions[
                      sessions.length - 2
                  ].accuracy
              ) || 0;


          const latest =
              Number(
                  sessions[
                      sessions.length - 1
                  ].accuracy
              ) || 0;


          return latest - previous;

      },


  /*
   * Convert performance into
   * a simple activity status.
   */

  getStatus:
      function(
          averageAccuracy,
          improvement
      ) {

          if (
              averageAccuracy >= 85 ||
              (
                  improvement >= 10 &&
                  averageAccuracy >= 70
              )
          ) {

              return "Improving";

          }


          if (
              averageAccuracy < 60 ||
              improvement <= -15
          ) {

              return "Needs Support";

          }


          return "Stable";

      },


  /*
   * Analyze one cognitive domain.
   */

  analyzeDomain:
      function(
          gameName
      ) {

          const sessions =
              this.getGameSessions(
                  gameName
              );


          if (
              sessions.length === 0
          ) {

              return {

                  game:
                      gameName,

                  domain:
                      this.GAME_DOMAINS[
                          gameName
                      ] || "Activity",

                  sessionsAnalyzed:
                      0,

                  averageAccuracy:
                      0,

                  improvement:
                      0,

                  status:
                      "No Data",

                  latestLevel:
                      0

              };

          }


          const recentSessions =
              sessions.slice(
                  -this.RECENT_SESSIONS
              );


          const averageAccuracy =
              this.calculateAverageAccuracy(
                  recentSessions
              );


          const improvement =
              this.calculateImprovement(
                  recentSessions
              );


          const status =
              this.getStatus(
                  averageAccuracy,
                  improvement
              );


          const latestSession =
              recentSessions[
                  recentSessions.length - 1
              ];


          return {

              game:
                  gameName,

              domain:
                  this.GAME_DOMAINS[
                      gameName
                  ] || "Activity",

              sessionsAnalyzed:
                  recentSessions.length,

              averageAccuracy:
                  averageAccuracy,

              improvement:
                  improvement,

              status:
                  status,

              latestLevel:
                  Number(
                      latestSession.level
                  ) || 1

          };

      },


  /*
   * Analyze every activity.
   */

  analyzeAllDomains:
      function() {

          const games = [

              "Memory Match",

              "sorting-matching",

              "relationship-match",

              "guided-yoga-focus"

          ];


          const results = {};


          games.forEach(
              function(gameName) {

                  results[gameName] =
                      NeuroSaathiCognitiveProfile
                          .analyzeDomain(
                              gameName
                          );

              }
          );


          return results;

      },


  /*
   * Calculate overall activity accuracy.
   */

  getOverallAccuracy:
      function() {

          const results =
              this.analyzeAllDomains();


          let total = 0;

          let count = 0;


          Object.keys(results)
              .forEach(
                  function(gameName) {

                      const result =
                          results[
                              gameName
                          ];


                      if (
                          result.sessionsAnalyzed >
                          0
                      ) {

                          total +=
                              result.averageAccuracy;

                          count++;

                      }

                  }
              );


          if (
              count === 0
          ) {

              return 0;

          }


          return Math.round(
              total / count
          );

      },


  /*
   * Count total completed activities.
   */

  getTotalSessions:
      function() {

          if (
              typeof NeuroSaathiPerformance ===
              "undefined"
          ) {

              return 0;

          }


          const data =
              NeuroSaathiPerformance
                  .getAllData();


          return data.length;

      },


  /*
   * Generate a caregiver-friendly
   * summary message.
   */

  generateSummary:
      function() {

          const results =
              this.analyzeAllDomains();


          const improving = [];

          const support = [];

          const stable = [];


          Object.keys(results)
              .forEach(
                  function(gameName) {

                      const result =
                          results[
                              gameName
                          ];


                      if (
                          result.status ===
                          "Improving"
                      ) {

                          improving.push(
                              result.domain
                          );

                      }

                      else if (
                          result.status ===
                          "Needs Support"
                      ) {

                          support.push(
                              result.domain
                          );

                      }

                      else if (
                          result.status ===
                          "Stable"
                      ) {

                          stable.push(
                              result.domain
                          );

                      }

                  }
              );


          if (
              improving.length === 0 &&
              support.length === 0 &&
              stable.length === 0
          ) {

              return (
                  "More activity data is needed " +
                  "to create a cognitive activity summary."
              );

          }


          if (
              support.length > 0
          ) {

              return (
                  "Some activities may benefit " +
                  "from additional support and " +
                  "comfortable practice."
              );

          }


          if (
              improving.length > 0
          ) {

              return (
                  "Recent activity performance " +
                  "shows positive progress."
              );

          }


          return (
              "Recent activity performance " +
              "is relatively stable."
          );

      },


  /*
   * Get the latest 7 activity sessions.
   *
   * This data will be used later
   * for the caregiver trend chart.
   */

  getRecentTrend:
      function() {

          if (
              typeof NeuroSaathiPerformance ===
              "undefined"
          ) {

              return [];

          }


          const sessions =
              NeuroSaathiPerformance
                  .getAllData();


          if (
              !sessions ||
              sessions.length === 0
          ) {

              return [];

          }


          const recentSessions =
              sessions.slice(-7);


          return recentSessions.map(
              function(session) {

                  return {

                      date:
                          new Date(
                              session.timestamp
                          ).toLocaleDateString(
                              "en-IN",
                              {
                                  day: "2-digit",
                                  month: "short"
                              }
                          ),

                      game:
                          session.game,

                      accuracy:
                          Number(
                              session.accuracy
                          ) || 0,

                      level:
                          Number(
                              session.level
                          ) || 1

                  };

              }
          );

      },


  /*
   * Return a complete profile.
   */

  generateProfile:
      function() {

          return {

              overallAccuracy:
                  this.getOverallAccuracy(),

              totalSessions:
                  this.getTotalSessions(),

              activities:
                  this.analyzeAllDomains(),

              summary:
                  this.generateSummary(),

              recentTrend:
                  this.getRecentTrend(),

              disclaimer:
                  "This profile summarizes activity " +
                  "performance and is not a medical diagnosis."

          };

      }

};