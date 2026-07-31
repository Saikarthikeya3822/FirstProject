package com.Karthikeya.ecommerce.Ai_service_9_rag.Service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
@Service
public class RagAnswerService {

    private final ChatClient ragChatClient;
    private final RagRetrievalService retrievalService;

    public RagAnswerService(
            @Qualifier("ragChatClient") ChatClient ragChatClient,
            RagRetrievalService retrievalService) {

        this.ragChatClient = ragChatClient;
        this.retrievalService = retrievalService;
    }

    public String answer(String question) {

        String context =
                retrievalService.getContext(question);

        String prompt = """
                Answer only using the provided context.

                Context:
                %s

                Question:
                %s

                If the answer is not present in the context,
                say:
                "I could not find the answer in the knowledge base."
                """
                .formatted(context, question);

        return ragChatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }
}
