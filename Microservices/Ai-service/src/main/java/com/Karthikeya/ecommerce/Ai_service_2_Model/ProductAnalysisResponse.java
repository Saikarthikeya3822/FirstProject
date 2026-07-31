package com.Karthikeya.ecommerce.Ai_service_2_Model;

import java.util.List;

public class ProductAnalysisResponse {
	private String summary;

	private List<String> pros;

	private List<String> cons;

	private List<String> alternatives;
	private String recommendation;

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public List<String> getPros() {
		return pros;
	}

	public void setPros(List<String> pros) {
		this.pros = pros;
	}

	public List<String> getCons() {
		return cons;
	}

	public void setCons(List<String> cons) {
		this.cons = cons;
	}

	public List<String> getAlternatives() {
		return alternatives;
	}

	public void setAlternatives(List<String> alternatives) {
		this.alternatives = alternatives;
	}

	public String getRecommendation() {
		return recommendation;
	}

	public void setRecommendation(String recommendation) {
		this.recommendation = recommendation;
	}
}
