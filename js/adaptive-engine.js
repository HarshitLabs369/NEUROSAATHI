/*
 * NEUROSAATHA
 * ADAPTIVE COGNITIVE ENGINE
 *
 * Analyzes recent game performance and recommends
 * an appropriate difficulty level.
 *
 * IMPORTANT:
 * This system provides activity recommendations.
 * It does NOT diagnose or assess medical conditions.
 */

const NeuroSaathiAdaptiveEngine = {

  MAX_LEVEL: 4,
  RECENT_SESSIONS: 5,


  /*
   * Analyze one game's performance.
   */
  analyzeGame: function(gameName) {

      if (
          typeof NeuroSaathiPerformance ===
          "undefined"
      ) {

          return {
              status: "error",
              message:
                  "Performance tracking system not found."
          };

      }


      const sessions =
          NeuroSaathiPerformance
              .getGameData(gameName);


      if (
          !sessions ||
          sessions.length === 0
      ) {

          return {

              status: "no-data",

              currentLevel: 1,

              recommendedLevel: 1,

              averageAccuracy: 0,

              improvement: 0,

              averageMistakes: 0,

              sessionsAnalyzed: 0,

              message:
                  "Not enough performance data yet."

          };

      }


      /*
       * Only use the most recent sessions.
       */
      const recentSessions =
          sessions.slice(
              -this.RECENT_SESSIONS
          );


      /*
       * Calculate average accuracy.
       */
      let totalAccuracy = 0;

      let totalMistakes = 0;


      recentSessions.forEach(
          function(session) {

              totalAccuracy +=
                  Number(
                      session.accuracy
                  ) || 0;

              totalMistakes +=
                  Number(
                      session.mistakes
                  ) || 0;

          }
      );


      const averageAccuracy =
          Math.round(
              totalAccuracy /
              recentSessions.length
          );


      const averageMistakes =
          Math.round(
              totalMistakes /
              recentSessions.length
          );


      /*
       * Compare the latest session
       * with the previous session.
       */
      let improvement = 0;


      if (
          recentSessions.length >= 2
      ) {

          const previous =
              Number(
                  recentSessions[
                      recentSessions.length - 2
                  ].accuracy
              ) || 0;


          const latest =
              Number(
                  recentSessions[
                      recentSessions.length - 1
                  ].accuracy
              ) || 0;


          improvement =
              latest - previous;

      }


      /*
       * Latest known level.
       */
      const latestSession =
          recentSessions[
              recentSessions.length - 1
          ];


      let currentLevel =
          Number(
              latestSession.level
          ) || 1;


      /*
       * Keep level between 1 and 4.
       */
      currentLevel =
          Math.max(
              1,
              Math.min(
                  this.MAX_LEVEL,
                  currentLevel
              )
          );


      let recommendedLevel =
          currentLevel;


      let status =
          "stable";


      /*
       * STRONG PERFORMANCE
       *
       * High accuracy or clear improvement.
       */
      if (
          averageAccuracy >= 85 ||
          (
              improvement >= 10 &&
              averageAccuracy >= 70
          )
      ) {

          status =
              "improving";


          if (
              currentLevel <
              this.MAX_LEVEL
          ) {

              recommendedLevel =
                  currentLevel + 1;

          }

      }


      /*
       * STRUGGLING PERFORMANCE
       *
       * Low accuracy or significant decline.
       */
      else if (
          averageAccuracy < 60 ||
          improvement <= -15
      ) {

          status =
              "struggling";


          if (
              currentLevel > 1
          ) {

              recommendedLevel =
                  currentLevel - 1;

          }

      }


      /*
       * STABLE PERFORMANCE
       */
      else {

          status =
              "stable";

          recommendedLevel =
              currentLevel;

      }


      /*
       * Generate explanation.
       */
      const message =
          this.generateMessage(
              status,
              recommendedLevel,
              improvement
          );


      return {

          status:
              status,

          currentLevel:
              currentLevel,

          recommendedLevel:
              recommendedLevel,

          averageAccuracy:
              averageAccuracy,

          improvement:
              improvement,

          averageMistakes:
              averageMistakes,

          sessionsAnalyzed:
              recentSessions.length,

          message:
              message

      };

  },


  /*
   * Generate a caregiver-friendly explanation.
   */
  generateMessage: function(
      status,
      recommendedLevel,
      improvement
  ) {

      if (
          status ===
          "improving"
      ) {

          if (
              improvement > 0
          ) {

              return (
                  "Recent performance is improving. " +
                  "The next activity can gradually become more challenging."
              );

          }

          return (
              "Performance is strong. " +
              "A higher activity difficulty may be appropriate."
          );

      }


      if (
          status ===
          "struggling"
      ) {

          return (
              "Recent performance suggests the activity may be difficult. " +
              "A lower difficulty may provide a more comfortable challenge."
          );

      }


      return (
          "Recent performance is relatively stable. " +
          "Continue with the current activity difficulty."
      );

  },


  /*
   * Analyze every NEUROSAATHA activity.
   */
  analyzeAllGames: function() {

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
                  NeuroSaathiAdaptiveEngine
                      .analyzeGame(
                          gameName
                      );

          }
      );


      return results;

  },


  /*
   * Get only the recommended level.
   */
  getRecommendedLevel: function(
      gameName
  ) {

      const result =
          this.analyzeGame(
              gameName
          );


      return result.recommendedLevel;

  }

};