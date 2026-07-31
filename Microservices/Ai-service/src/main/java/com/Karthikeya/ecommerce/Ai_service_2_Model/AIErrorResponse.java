package com.Karthikeya.ecommerce.Ai_service_2_Model;

public class AIErrorResponse {
	private String errorCode;
	private String message;

	public AIErrorResponse() {
	}

	public AIErrorResponse(String errorCode, String message) {

		this.errorCode = errorCode;
		this.message = message;
	}

	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
