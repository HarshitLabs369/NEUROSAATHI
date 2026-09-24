/*
 * NEUROSAATHI
 * PERFORMANCE TRACKING SYSTEM
 *
 * Stores game activity locally for now.
 * Later this data can be synced to Firebase
 * and used by the Adaptive Engine.
 */

const NeuroSaathiPerformance = {

  STORAGE_KEY: "neurosaathi_performance",

  getAllData: function() {

      try {

          const saved =
              localStorage.getItem(
                  this.STORAGE_KEY
              );

          if (!saved) {
              return [];
          }

          return JSON.parse(saved);

      } catch (error) {

          console.log(
              "Performance data could not be loaded."
          );

          return [];
      }
  },


  saveGameSession: function(session) {

      const data =
          this.getAllData();

      const completeSession = {

          game:
              session.game || "unknown",

          level:
              session.level || 1,

          accuracy:
              session.accuracy || 0,

          attempts:
              session.attempts || 0,

          correct:
              session.correct || 0,

          mistakes:
              session.mistakes || 0,

          completionTime:
              session.completionTime || 0,

          completed:
              session.completed !== false,

          timestamp:
              new Date().toISOString()

      };


      data.push(completeSession);


      try {

          localStorage.setItem(
              this.STORAGE_KEY,
              JSON.stringify(data)
          );

          console.log(
              "NeuroSaathi session saved:",
              completeSession
          );

      } catch (error) {

          console.log(
              "Performance data could not be saved."
          );

      }

  },


  getGameData: function(gameName) {

      const data =
          this.getAllData();

      return data.filter(
          function(session) {

              return session.game === gameName;

          }
      );

  },


  getRecentSessions: function(limit) {

      const data =
          this.getAllData();

      if (!limit) {
          limit = 10;
      }

      return data.slice(-limit);

  },


  clearAllData: function() {

      localStorage.removeItem(
          this.STORAGE_KEY
      );

      console.log(
          "NeuroSaathi performance data cleared."
      );

  }

};