const path = require("path");
const fs = require("fs");
const child = require("child_process");
const ffmpegPath = require("ffmpeg-static");

const soundDir = path.join(__dirname, "..", "public", "assets", "sound");

function run(args) {
  const res = child.spawnSync(ffmpegPath, args, { stdio: "inherit" });
  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error("ffmpeg failed: " + res.status);
}

function convert() {
  if (!fs.existsSync(soundDir)) {
    console.error("Sound dir not found:", soundDir);
    process.exit(1);
  }

  // sfx_hit.wav -> mp3, ogg
  const sfxHit = path.join(soundDir, "sfx_hit.wav");
  if (fs.existsSync(sfxHit)) {
    console.log("Converting sfx_hit.wav -> sfx_hit.mp3");
    run([
      "-y",
      "-i",
      sfxHit,
      "-b:a",
      "128k",
      path.join(soundDir, "sfx_hit.mp3"),
    ]);
    console.log("Converting sfx_hit.wav -> sfx_hit.ogg");
    run([
      "-y",
      "-i",
      sfxHit,
      "-c:a",
      "libvorbis",
      "-qscale:a",
      "5",
      path.join(soundDir, "sfx_hit.ogg"),
    ]);
  }

  // sfx_pickup.ogg -> mp3, wav
  const pickupOgg = path.join(soundDir, "sfx_pickup.ogg");
  if (fs.existsSync(pickupOgg)) {
    console.log("Converting sfx_pickup.ogg -> sfx_pickup.mp3");
    run([
      "-y",
      "-i",
      pickupOgg,
      "-b:a",
      "128k",
      path.join(soundDir, "sfx_pickup.mp3"),
    ]);
    console.log("Converting sfx_pickup.ogg -> sfx_pickup.wav");
    run(["-y", "-i", pickupOgg, path.join(soundDir, "sfx_pickup.wav")]);
  }

  // bmg.mp3 -> bgm.mp3 (copy) and bgm.ogg
  const bmg = path.join(soundDir, "bmg.mp3");
  const bgm = path.join(soundDir, "bgm.mp3");
  if (fs.existsSync(bmg)) {
    if (!fs.existsSync(bgm)) {
      console.log("Copying bmg.mp3 -> bgm.mp3");
      fs.copyFileSync(bmg, bgm);
    }
    console.log("Converting bmg.mp3 -> bgm.ogg");
    run([
      "-y",
      "-i",
      bmg,
      "-c:a",
      "libvorbis",
      "-qscale:a",
      "6",
      path.join(soundDir, "bgm.ogg"),
    ]);
  }

  console.log("Conversiones completadas.");
}

try {
  convert();
} catch (e) {
  console.error("Error during conversion:", e);
  process.exit(1);
}
