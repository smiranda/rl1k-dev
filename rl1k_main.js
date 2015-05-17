/* global game_tag */
/* global EngineModule */

var engine = EngineModule.CreateEngine();
var border = 50;
var win_w = window.innerWidth * window.devicePixelRatio - border;
var win_h = window.innerHeight * window.devicePixelRatio - border;
engine.Init(win_w, win_h, game_tag);