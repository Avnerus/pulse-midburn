package http.requests;

import org.json.simple.JSONObject;



public class HttpClient {
	
	public static HttpResult doPost(String url, JSONObject json){
		HttpResult result = new HttpResult();
		
		PostRequest post = new PostRequest(url);

		post.addData("data", json.toJSONString());
		post.send();
		
		result.data = post.getContent();
		result.length = post.getHeader("Content-Length");
				
		return result;
	}
	
	public static HttpResult doGet(String url, JSONObject json){
		HttpResult result = new HttpResult();
		
		GetRequest get = new GetRequest(url);

		get.send();
		
		result.data = get.getContent();
		result.length = get.getHeader("Content-Length");
				
		return result;
	}

}
