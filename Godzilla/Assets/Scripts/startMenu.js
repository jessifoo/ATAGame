

var wakeUp : GUIText;
var quickIntro : GUIText;
var quickIntro2 : GUIText;
var quickIntro3 : GUIText;
var credits1: GUIText;
var credits2: GUIText;

function Start () {

}

function Update () {

}

//var guiSkin : GUISkin;

function OnGUI() {
		//GUI.skin = guiSkin;
		//GUILayout.Button ("I am a re-Skinned Button");
		
		
		//if (GUI.Button(Rect((Screen.width/2)-230,Screen.height-100,100,30),"Instructions")){
		//	Debug.Log ("Button");
    	//	Application.LoadLevel ("Instructions");
    	//}
    	//GUI.Label(Rect(0,0,Screen.height*2,Screen.width),background);
		
    	
			
			if (GUI.Button(Rect((Screen.width/2)-30,Screen.height-150,100,30),"Start")){
    		LevelLoadFade.FadeAndLoadLevel("GridCity_Big", Color.white, 2.0);
    	}
		//	if (GUI.Button(Rect((Screen.width/2)+100,Screen.height-100,100,30),"Credits")){
    	//	LevelLoadFade.FadeAndLoadLevel("Credits", Color.white, 2.0);
    	//}
    	
}