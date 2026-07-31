package com.Karthikeya.ecommerce.Ai_service_3_ai_orchestration;

import com.Karthikeya.ecommerce.Ai_service_2_Model.UserInsightResponse;

public interface UserInsightService {
	UserInsightResponse generateInsights(String userId,String token);

}
