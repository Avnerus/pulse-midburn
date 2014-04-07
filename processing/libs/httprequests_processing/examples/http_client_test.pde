import http.requests.*;

import java.util.HashMap;
import java.util.Map;
import org.json.simple.JSONObject;

void setup(){
   
    JSONObject json = new JSONObject();
    Map map = new HashMap<String, String>();
    map.put("key_name", "key_val");
    json.putAll(map);
    
    
    HttpClient.doPost("http://localhost:3005/test", json);
}
