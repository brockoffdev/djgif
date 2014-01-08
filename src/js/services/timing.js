;(function (app) {
  'use strict';

  app.factory('Timing', function ($rootScope, GifSequence) {
    var beatVis = document.querySelectorAll('.beat-vis')[0];

    var Timing = $rootScope.$new(true);
    Timing.audioStartedAt = 0;
    Timing.beats = [];
    Timing.beatIndex = 0;
    Timing.playing = false;

    Timing.frame = function () {
      if (Timing.playing) requestAnimationFrame(Timing.frame);

      // Add 8ms to compensate for display refresh
      var positionSecs = (8 + performance.now()) / 1000 - Timing.audioStartedAt;

      while (Timing.beatIndex < Timing.beats.length && positionSecs > Timing.beats[Timing.beatIndex].start) {
        Timing.beatIndex++;
      }
      var beat = Timing.beats[Timing.beatIndex - 1];

      var sinceLastBeat = positionSecs - beat.start,
        beatFraction = sinceLastBeat / beat.duration;

      GifSequence.showGifFraction(beatFraction);

//      console.log(positionSecs, beat.start, beat.duration, sinceLastBeat, beatFraction)

//      beatVis.style.opacity = 0.5 - beatFraction / 2
    }

    Timing.adjustStartTime = function(rdioTime) {
      var oldStartTime = Timing.audioStartedAt;
      Timing.audioStartedAt = performance.now() / 1000 - rdioTime;
      console.log("Synch out by " + (oldStartTime - Timing.audioStartedAt))
    };

    Timing.startTrack = function (track, beats) {
//      Timing.audioStartedAt = undefined;
      Timing.playing = true;
      Timing.beats = beats;
      Timing.beatIndex = 0;
      console.log(beats)
      requestAnimationFrame(Timing.frame);
    };

    Timing.stopPlaying = function () {
      Timing.playing = false;
    };

    return Timing;
  })

})(angular.module('djgif'));
