
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Document } from '../data/model/documents';
const documents = require('../../../assets/data/documents.json');

/**
 * An object used to get page information from the server
 */
export class Page {
  // The number of elements in the page
  size: number = 0;
  // The total number of elements
  totalElements: number = 0;
  // The total number of pages
  totalPages: number = 0;
  // The current page number
  pageNumber: number = 0;
}

/**
 * An array of data with an associated page object used for paging
 */
export class PagedData<T> {
  data = new Array<T>();
  page = new Page();
}

/**
 * A server used to mock a paged data result from a server
 */
@Injectable()
export class MockServerResultsService {
  /**
   * A method that mocks a paged server response
   * @param page The selected page
   * @returns {any} An observable containing the employee data
   */
  public getResults(page: Page): Observable<PagedData<Document>> {
    return of(documents).pipe(map(data => this.getPagedData(page)));
  }

  /**
   * Package documents into a PagedData object based on the selected Page
   * @param page The page data used to get the selected data from documents
   * @returns {PagedData<Document>} An array of the selected data and page
   */
  private getPagedData(page: Page): PagedData<Document> {
    const pagedData = new PagedData<Document>();
    page.totalElements = documents.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min(start + page.size, page.totalElements);
    for (let i = start; i < end; i++) {
      const jsonObj = documents[i];
      const employee = new Document(jsonObj.name, jsonObj.gender, jsonObj.company, jsonObj.age);
      pagedData.data.push(employee);
    }
    pagedData.page = page;
    return pagedData;
  }
}
