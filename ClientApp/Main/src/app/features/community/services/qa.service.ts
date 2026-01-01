import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Question, Answer, CreateQuestionRequest, CreateAnswerRequest } from '../../../core/models/qa.model';
import { Result, PaginatedResult } from '../../../core/models/result.model';

@Injectable({
    providedIn: 'root'
})
export class QAService {
    private apiUrl = `${environment.apiUrl}/v2.0/community/qa`;

    constructor(private http: HttpClient) { }

    getQuestions(pageNumber: number = 1, pageSize: number = 10, groupId?: string): Observable<PaginatedResult<Question>> {
        let url = `${this.apiUrl}/questions?pageNumber=${pageNumber}&pageSize=${pageSize}`;
        if (groupId) {
            url += `&groupId=${groupId}`;
        }
        return this.http.get<PaginatedResult<Question>>(url);
    }

    getQuestion(id: string): Observable<Result<Question>> {
        return this.http.get<Result<Question>>(`${this.apiUrl}/questions/${id}`);
    }

    askQuestion(request: CreateQuestionRequest): Observable<Result<Question>> {
        return this.http.post<Result<Question>>(`${this.apiUrl}/questions`, request);
    }

    answerQuestion(request: CreateAnswerRequest): Observable<Result<Answer>> {
        return this.http.post<Result<Answer>>(`${this.apiUrl}/answers`, request);
    }

    voteQuestion(id: string, isUpvote: boolean): Observable<Result<any>> {
        return this.http.post<Result<any>>(`${this.apiUrl}/questions/${id}/vote`, { isUpvote });
    }

    voteAnswer(id: string, isUpvote: boolean): Observable<Result<any>> {
        return this.http.post<Result<any>>(`${this.apiUrl}/answers/${id}/vote`, { isUpvote });
    }

    acceptAnswer(questionId: string, answerId: string): Observable<Result<any>> {
        return this.http.post<Result<any>>(`${this.apiUrl}/questions/${questionId}/accept-answer/${answerId}`, {});
    }
}
