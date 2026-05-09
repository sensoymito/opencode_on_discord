// ScriptAPI Utility Script
// Features: Fall Damage Cancel + Auto Sprint + Velocity

var script = registerScript({
    name: "UtilityPlus",
    version: "1.0.0",
    authors: ["User"]
});

// Fall Damage Cancel
script.registerModule({
    name: "NoFall",
    category: "PLAYER",
    description: "Cancel fall damage"
}, function(module) {
    module.on("update", function() {
        if (!mc.thePlayer.onGround && mc.thePlayer.fallDistance > 2.0) {
            mc.thePlayer.fallDistance = 0;
        }
    });
});

// Auto Sprint
script.registerModule({
    name: "AutoSprint",
    category: "MOVEMENT",
    description: "Automatically sprint"
}, function(module) {
    module.on("update", function() {
        if (mc.gameSettings.keyBindForward.pressed && !mc.thePlayer.isSprinting() && mc.thePlayer.moveForward > 0) {
            mc.thePlayer.setSprinting(true);
        }
    });
});

// Anti Velocity (Knockback reduction)
script.registerModule({
    name: "Velocity",
    category: "COMBAT",
    description: "Reduce knockback"
}, function(module) {
    module.on("push", function(event) {
        event.setX(event.getX() * 0.0);
        event.setY(event.getY() * 0.0);
        event.setZ(event.getZ() * 0.0);
    });
});

// Chat notification on load
mc.thePlayer.addChatMessage(new net.minecraft.util.ChatComponentText(
    "§a[UtilityPlus] §7Loaded! Modules: §eNoFall, AutoSprint, Velocity"
));
