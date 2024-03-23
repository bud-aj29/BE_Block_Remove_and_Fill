import { world, system } from '@minecraft/server';

const replaceList = {'water_bucket' : 'water',
				'lava_bucket' : 'lava',
				'powder_snow_bucket' : 'powder_snow'}

const toggleItem = "minecraft:bucket";
const toggleName = "rem_fill";//pack
const toggleData = toggleName + "T1";//toggle1
				
world.afterEvents.itemUse.subscribe(event=>{
	switch(event.itemStack.typeId){
		case toggleItem :
			toggle(event.source);
			break;
	}
});
function toggle(player){
	let toggle = player.getDynamicProperty(toggleData);
	toggle = (toggle === undefined ? 0 : toggle);
	
	switch(toggle){
		case 0 ://1
			player.setDynamicProperty(toggleData, 1);
			player.sendMessage("Fill_Small");
			fill(player);
			break;
		case 1 ://2
			player.setDynamicProperty(toggleData, 2);
			player.sendMessage("Fill_Large");
			fill(player);
			break;
		case 2 ://3
			player.setDynamicProperty(toggleData, 3);
			player.sendMessage("Remove_Cube");
			fill(player);
			break;
		case 3 ://4
			player.setDynamicProperty(toggleData, 4);
			player.sendMessage("Remove_Wide");
			fill(player);
			break;
		case 4 ://0
			player.setDynamicProperty(toggleData, 0);
			player.sendMessage("Remove_Fill_Off");
			break;
	}
}
function fill(player){
	let runLoop = system.runInterval(() => {
		const toggle = player.getDynamicProperty(toggleData);
		let mainItem = player.getComponent("minecraft:equippable").getEquipment("Mainhand");
		mainItem = (mainItem ? mainItem.typeId : 0);
		
		if(toggle && mainItem && mainItem != toggleItem){
			for (const [key, value] of Object.entries(replaceList)) {
				mainItem = mainItem.replace(key, value);
			}
			switch(toggle){
				case 1 :
					player.runCommand("fill ~-4 ~-1 ~-4 ~4 ~-1 ~4 " + mainItem);//Fill Small
					break;
				case 2 :
					player.runCommand("fill ~-33 ~-1 ~-33 ~34 ~-1 ~34 " + mainItem);//Fill Large
					break;
				case 3 :
					player.runCommand("fill ~-15 ~-15 ~-15 ~16 ~16 ~16 air [] replace " + mainItem);//Remove Cube
					break;
				case 4 :
					player.runCommand("fill ~-33 ~-4 ~-33 ~34 ~2 ~34 air [] replace " + mainItem);//Remove Wide
					break;
			}
		}
		if(!toggle){
			system.clearRun(runLoop);
		}
	}, 20);
}