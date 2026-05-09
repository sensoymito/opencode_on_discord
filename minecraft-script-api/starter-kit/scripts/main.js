import { world, system, ItemTypes, ModalFormData } from "@minecraft/server";

// スターターキットの内容
const STARTER_KIT = [
  { itemId: "minecraft:wooden_sword", quantity: 1 },
  { itemId: "minecraft:wooden_pickaxe", quantity: 1 },
  { itemId: "minecraft:wooden_axe", quantity: 1 },
  { itemId: "minecraft:cooked_beef", quantity: 32 },
  { itemId: "minecraft:torch", quantity: 16 },
  { itemId: "minecraft:oak_planks", quantity: 32 },
];

// 配布済みプレイヤーの記録
const giftedPlayers = new Set();

// プレイヤー参加時の処理
world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player;

  // 初回参加時のみ処理
  if (giftedPlayers.has(player.id)) return;
  giftedPlayers.add(player.id);

  giveStarterKit(player);
  sendWelcomeMessage(player);
});

// スターターキットを配布する関数
function giveStarterKit(player) {
  for (const item of STARTER_KIT) {
    const itemStack = {
      typeId: item.itemId,
      amount: item.quantity,
    };
    player.inventory.addItem(itemStack);
  }
}

// 歓迎メッセージを送信
function sendWelcomeMessage(player) {
  const messages = [
    "§l§6=== Welcome to the Server! ===",
    "§eスターターキットをインベントリに追加しました！",
    "§a- 木製の剣、ツルハシ、斧",
    "§a- 焼いた牛肉 x32",
    "§a- 松明 x16",
    "§a- オークの板材 x32",
    "§7チャットで §b!kit§7 と入力して再取得可能！",
    "§l§6=============================",
  ];

  for (const msg of messages) {
    player.sendMessage(msg);
  }
}

// チャットコマンドの処理
world.beforeEvents.chatSend.subscribe((event) => {
  const message = event.message.toLowerCase().trim();
  const player = event.sender;

  if (message === "!kit") {
    event.cancel = true;
    giveStarterKit(player);
    player.sendMessage("§aスターターキットを再配布しました！");
  }

  if (message === "!help") {
    event.cancel = true;
    player.sendMessage("§l§6=== コマンド一覧 ===");
    player.sendMessage("§b!kit§7 - スターターキットを入手");
    player.sendMessage("§b!help§7 - このヘルプを表示");
    player.sendMessage("§b!time§7 - 現在の時間を表示");
    player.sendMessage("§b!pos§7 - 現在地を表示");
    player.sendMessage("§l§6=====================");
  }

  if (message === "!time") {
    event.cancel = true;
    const time = world.getTimeOfDay();
    const timeStr = getTimeString(time);
    player.sendMessage(`§e現在の時間: §b${timeStr}`);
  }

  if (message === "!pos") {
    event.cancel = true;
    const pos = player.location;
    player.sendMessage(
      `§e現在地: §bX:${Math.floor(pos.x)} Y:${Math.floor(pos.y)} Z:${Math.floor(pos.z)}`
    );
  }
});

// 時間文字列に変換
function getTimeString(time) {
  const hours = Math.floor((time / 1000 + 6) % 24);
  const minutes = Math.floor(((time / 1000 + 6) % 1) * 60);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

// プレイヤー死亡時のメッセージ
world.afterEvents.playerDie.subscribe((event) => {
  const player = event.player;
  const pos = player.location;

  system.runTimeout(() => {
    player.sendMessage(
      `§c死亡しました！ 現在地: X:${Math.floor(pos.x)} Y:${Math.floor(pos.y)} Z:${Math.floor(pos.z)}`
    );
  }, 20);
});

// サーバー起動時のログ
system.run(() => {
  world.sendMessage("§l§a[StarterKit] §eスクリプトが読み込まれました！");
});
