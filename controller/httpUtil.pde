

import http.requests.*;

import java.util.HashMap;
import java.util.Map;
import org.json.simple.JSONObject;

public void updateServer(int playerId, int bpm){
  
   JSONObject json = new JSONObject();
   Map map = new HashMap<String, String>();
   map.put("bpm", String.valueOf(bpm));
   json.putAll(map);
    
   HttpClient.doPost("http://localhost:3005/beat/" + playerId, json); 
}
