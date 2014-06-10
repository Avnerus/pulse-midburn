

import http.requests.*;

import java.util.HashMap;
import java.util.Map;
import org.json.simple.JSONObject;

public void updateServer(int playerId, int bpm, int change){
  
   JSONObject json = new JSONObject();
   Map map = new HashMap<String, String>();
   map.put("bpm", String.valueOf(bpm));
   map.put("change", String.valueOf(change));
   json.putAll(map);
//   println(json);
    
   HttpClient.doPost("http://192.168.0.103:3005/beat/" + playerId, json); 
}
