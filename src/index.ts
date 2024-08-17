import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { Dialogue, ResponseData } from './types/duolingo-response.types';

async function fetchDuolingoData(url: string): Promise<ResponseData | null> {
  try {
    const response = await axios.get<ResponseData>(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

function extractPhrases(data: ResponseData): string[] {
  const phrasesWithTranslations: string[] = [];

  data.elements.forEach((element) => {
    if (element.type === 'dialogue') {
      const dialogue: Dialogue = element as Dialogue;

      dialogue.element.phrases.forEach((phrase) => {
        const germanPhrase = phrase.text.styledString.text;
        const translation = phrase.subtext.styledString.text;
        const formattedPhrase = `${germanPhrase} (${translation})`;
        phrasesWithTranslations.push(formattedPhrase);
      });
    }
  });

  return phrasesWithTranslations;
}

async function fetchGuidebookPhrases(lessonNumber: number) {
  const guidebookUrlsPath = path.join(__dirname, '../data/guidebook-urls.json');
  const guidebookUrlsData = await fs.readFile(guidebookUrlsPath, 'utf-8');
  const guidebookUrls: Record<number, string> = JSON.parse(guidebookUrlsData);

  const lessonNumbers = Object.keys(guidebookUrls).map(Number);
  const minLessonNumber = Math.min(...lessonNumbers);
  const maxLessonNumber = Math.max(...lessonNumbers);

  if (isNaN(lessonNumber) || !lessonNumbers.includes(lessonNumber)) {
    console.error(
      `Provide lesson number within range ${minLessonNumber}~${maxLessonNumber}`
    );
    return;
  }

  const url = guidebookUrls[lessonNumber];
  const data = await fetchDuolingoData(url);

  if (data) {
    const phrases = extractPhrases(data);
    const allPhrases = phrases
      .map((phrase, index) => `${index + 1}. ${phrase}`)
      .join('\n');

    console.log(allPhrases);
  }
}

const args = process.argv.slice(2);
const lessonNo = parseInt(args[0], 10);
fetchGuidebookPhrases(lessonNo);
