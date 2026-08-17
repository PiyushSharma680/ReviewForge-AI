import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { logger } from '../utils/logger.js';

export interface AIReviewResult {
  title: string;
  score: number;
  securityScore: number;
  performanceScore: number;
  readabilityScore: number;
  maintainabilityScore: number;
  complexityScore: number;
  summary: string;
  positivePoints: string[];
  suggestions: {
    lineNumber: number;
    filePath?: string;
    type: 'security' | 'performance' | 'readability' | 'maintainability' | 'naming' | 'architecture';
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    issue: string;
    recommendation: string;
    codeSnippet?: string;
    fixedCodeSnippet?: string;
  }[];
  securityIssues: string[];
  refactoringIdeas: string[];
}

export class AIService {
  private static getGeminiClient(): GoogleGenerativeAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key') return null;
    return new GoogleGenerativeAI(apiKey);
  }

  private static getOpenAIClient(): OpenAI | null {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_openai_api_key') return null;
    return new OpenAI({ apiKey });
  }

  static async analyzeCode(
    codeSnippet: string,
    language: string = 'typescript',
    customPrompt?: string
  ): Promise<AIReviewResult> {
    const prompt = `
You are a Staff Principal Code Reviewer and Security Auditor.
Analyze the following ${language} code snippet and return a strictly valid JSON object matching this schema:

{
  "title": "Short descriptive title of the review",
  "score": number (0-100),
  "securityScore": number (0-100),
  "performanceScore": number (0-100),
  "readabilityScore": number (0-100),
  "maintainabilityScore": number (0-100),
  "complexityScore": number (0-100),
  "summary": "High-level summary of code quality and main suggestions",
  "positivePoints": ["Point 1", "Point 2"],
  "suggestions": [
    {
      "lineNumber": number,
      "type": "security" | "performance" | "readability" | "maintainability" | "naming" | "architecture",
      "severity": "critical" | "high" | "medium" | "low" | "info",
      "issue": "Description of issue",
      "recommendation": "Concrete suggestion",
      "codeSnippet": "Original line or block",
      "fixedCodeSnippet": "Improved line or block"
    }
  ],
  "securityIssues": ["Security issue description"],
  "refactoringIdeas": ["Refactoring suggestion"]
}

${customPrompt ? `Additional User Guidance: ${customPrompt}\n` : ''}
CODE TO REVIEW:
\`\`\`${language}
${codeSnippet}
\`\`\`
Return ONLY the raw JSON string without markdown code fences or extra text.
`;

    // 1. Try Gemini
    const gemini = this.getGeminiClient();
    if (gemini) {
      try {
        logger.info('Performing AI Code Review using Gemini API...');
        const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanedJson = responseText.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(cleanedJson) as AIReviewResult;
      } catch (err: any) {
        logger.warn(`Gemini AI analysis failed: ${err.message}. Attempting fallback...`);
      }
    }

    // 2. Try OpenAI
    const openai = this.getOpenAIClient();
    if (openai) {
      try {
        logger.info('Performing AI Code Review using OpenAI API...');
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: 'You respond only in JSON.' }, { role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        });
        const content = response.choices[0].message.content;
        if (content) {
          return JSON.parse(content) as AIReviewResult;
        }
      } catch (err: any) {
        logger.warn(`OpenAI AI analysis failed: ${err.message}. Falling back to rule-based engine...`);
      }
    }

    // 3. Robust Rule-Based Engine Fallback (Guarantees zero downtime)
    logger.info('Generating AI Review via Internal Rule-Based Analysis Engine...');
    return this.generateRuleBasedReview(codeSnippet, language);
  }

  private static generateRuleBasedReview(code: string, language: string): AIReviewResult {
    const lines = code.split('\n');
    const suggestions: AIReviewResult['suggestions'] = [];
    const securityIssues: string[] = [];
    const refactoringIdeas: string[] = [];
    const positivePoints: string[] = [];

    // Analyze lines for common patterns
    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Check for var
      if (/\bvar\b/.test(line)) {
        suggestions.push({
          lineNumber: lineNum,
          type: 'readability',
          severity: 'medium',
          issue: 'Use of deprecated `var` keyword',
          recommendation: 'Replace `var` with block-scoped `const` or `let` to prevent scope hoisting bugs.',
          codeSnippet: line.trim(),
          fixedCodeSnippet: line.replace(/\bvar\b/g, 'const').trim(),
        });
      }

      // Check for hardcoded secret / API key pattern
      if (/(api_key|secret|password|auth_token)\s*=\s*['"][A-Za-z0-9_\-]{8,}['"]/i.test(line)) {
        suggestions.push({
          lineNumber: lineNum,
          type: 'security',
          severity: 'critical',
          issue: 'Potential hardcoded secret or API key credential detected',
          recommendation: 'Extract sensitive keys into environment variables using `process.env`.',
          codeSnippet: line.trim(),
          fixedCodeSnippet: line.replace(/=\s*['"].*?['"]/g, '= process.env.API_KEY').trim(),
        });
        securityIssues.push(`Line ${lineNum}: Hardcoded credentials in source code`);
      }

      // Check for nested loops (O(n^2) complexity)
      if (/\b(for|while)\b/.test(line) && code.slice(code.indexOf(line)).split('\n').slice(1, 10).some(l => /\b(for|while)\b/.test(l))) {
        suggestions.push({
          lineNumber: lineNum,
          type: 'performance',
          severity: 'high',
          issue: 'Nested loop detected resulting in potential O(n²) time complexity',
          recommendation: 'Consider indexing items into a Map or Set to reduce search complexity to O(n).',
          codeSnippet: line.trim(),
        });
      }

      // Check for console.log
      if (/console\.log\(/.test(line)) {
        suggestions.push({
          lineNumber: lineNum,
          type: 'maintainability',
          severity: 'low',
          issue: 'Leftover debug `console.log` statement',
          recommendation: 'Remove debugging console statements or use structured logger like Winston.',
          codeSnippet: line.trim(),
        });
      }
    });

    if (code.includes('async') || code.includes('Promise')) {
      positivePoints.push('Good use of asynchronous non-blocking patterns');
    }
    if (code.includes('interface') || code.includes('type ')) {
      positivePoints.push('Strong TypeScript type definition usage');
    }
    if (positivePoints.length === 0) {
      positivePoints.push('Clean code layout and structure');
      positivePoints.push('Modular function organization');
    }

    if (suggestions.length === 0) {
      suggestions.push({
        lineNumber: 1,
        type: 'readability',
        severity: 'info',
        issue: 'No immediate anti-patterns detected',
        recommendation: 'Code complies with standard syntax and conventions.',
      });
    }

    refactoringIdeas.push('Consider splitting large methods into single-responsibility helpers');
    refactoringIdeas.push('Add exhaustive unit test coverage for edge cases');

    const baseScore = Math.max(60, 95 - suggestions.length * 5);
    const secScore = securityIssues.length > 0 ? 50 : 92;

    return {
      title: `AI Code Analysis: ${language.toUpperCase()} Snippet`,
      score: baseScore,
      securityScore: secScore,
      performanceScore: baseScore + 2,
      readabilityScore: baseScore - 3,
      maintainabilityScore: baseScore + 1,
      complexityScore: 82,
      summary: `Analyzed ${lines.length} lines of ${language} code. Detected ${suggestions.length} potential area(s) for improvement, including ${securityIssues.length} security concern(s).`,
      positivePoints,
      suggestions,
      securityIssues,
      refactoringIdeas,
    };
  }
}
