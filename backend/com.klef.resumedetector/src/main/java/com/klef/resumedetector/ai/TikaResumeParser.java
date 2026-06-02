package com.klef.resumedetector.ai;

import org.apache.tika.metadata.Metadata;
import org.apache.tika.metadata.TikaCoreProperties;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class TikaResumeParser {

    public String extractText(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {
            BodyContentHandler handler = new BodyContentHandler(-1);
            Metadata metadata = new Metadata();

            // pass original filename so Tika detects PDF/DOCX correctly
            metadata.set(TikaCoreProperties.RESOURCE_NAME_KEY, file.getOriginalFilename());

            ParseContext context = new ParseContext();
            AutoDetectParser parser = new AutoDetectParser();
            parser.parse(inputStream, handler, metadata, context);

            return handler.toString().trim();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse resume file: " + e.getMessage());
        }
    }

    public String extractCandidateName(String parsedText) {
        if (parsedText == null || parsedText.isEmpty()) return "Unknown";
        String[] lines = parsedText.split("\\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (!trimmed.isEmpty() && trimmed.matches("[a-zA-Z ]{2,50}")) {
                return trimmed;
            }
        }
        return "Unknown";
    }

    public String extractEmail(String parsedText) {
        if (parsedText == null) return null;
        Pattern emailPattern = Pattern.compile(
                "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}");
        Matcher matcher = emailPattern.matcher(parsedText);
        return matcher.find() ? matcher.group() : null;
    }

    public Integer extractYearsOfExperience(String parsedText) {
        if (parsedText == null) return 0;
        Pattern expPattern = Pattern.compile(
                "(\\d+)\\s*\\+?\\s*years?\\s*(of\\s*experience)?",
                Pattern.CASE_INSENSITIVE);
        Matcher matcher = expPattern.matcher(parsedText);
        return matcher.find() ? Integer.parseInt(matcher.group(1)) : 0;
    }
}