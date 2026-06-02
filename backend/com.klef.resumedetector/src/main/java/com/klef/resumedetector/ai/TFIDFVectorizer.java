package com.klef.resumedetector.ai;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class TFIDFVectorizer {

    // convert text into a TF-IDF term frequency map
    public Map<String, Double> vectorize(String text) {
        if (text == null || text.isEmpty()) return new HashMap<>();

        // tokenize — split by non-word characters, lowercase
        String[] tokens = text.toLowerCase().split("[^a-zA-Z0-9+#]+");

        // remove stop words
        Set<String> stopWords = getStopWords();

        // term frequency count
        Map<String, Integer> termCount = new HashMap<>();
        int totalTerms = 0;

        for (String token : tokens) {
            token = token.trim();
            if (token.length() < 2 || stopWords.contains(token)) continue;
            termCount.put(token, termCount.getOrDefault(token, 0) + 1);
            totalTerms++;
        }

        // compute TF = count / total terms
        Map<String, Double> tfVector = new HashMap<>();
        for (Map.Entry<String, Integer> entry : termCount.entrySet()) {
            tfVector.put(entry.getKey(), (double) entry.getValue() / totalTerms);
        }

        return tfVector;
    }

    // common English stop words to filter out
    private Set<String> getStopWords() {
        return new HashSet<>(Arrays.asList(
                "the", "a", "an", "and", "or", "but", "in", "on", "at",
                "to", "for", "of", "with", "by", "from", "is", "are",
                "was", "were", "be", "been", "have", "has", "had", "do",
                "does", "did", "will", "would", "could", "should", "may",
                "might", "i", "you", "he", "she", "it", "we", "they",
                "my", "your", "his", "her", "its", "our", "their",
                "this", "that", "these", "those", "am", "not", "no"
        ));
    }
}