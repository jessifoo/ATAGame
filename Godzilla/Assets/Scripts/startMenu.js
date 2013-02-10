

var wakeUp : GUIText;
var quickIntro : GUIText;
var quickIntro2 : GUIText;
var quickIntro3 : GUIText;

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
    	
			
			if (GUI.Button(Rect((Screen.width/2)-180,Screen.height-100,100,30),"Start")){
    		LevelLoadFade.FadeAndLoadLevel("GridCity", Color.white, 2.0);
    	}
			if (GUI.Button(Rect((Screen.width/2)+100,Screen.height-100,100,30),"Credits")){
    		LevelLoadFade.FadeAndLoadLevel("Credits", Color.white, 2.0);
    	}
    	
}