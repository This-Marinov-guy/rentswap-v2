import { NextResponse } from 'next/server';

export class ApiResponseService {
  static sendError(message: string, tag: string = 'account:authentication.errors.general', code: number = 400) {
    return NextResponse.json(
      {
        status: false,
        message,
        tag,
      },
      { status: code }
    );
  }

  static sendInvalidFields(invalidFields: Record<string, string[]>, errorMessages: Record<string, any> = {}) {
    const errorTags: string[] = [];
    const missingFields: string[] = [];
    let hasRequiredError = false;

    for (const [field, messages] of Object.entries(invalidFields)) {
      for (const message of messages) {
        if (message.toLowerCase().includes('required')) {
          hasRequiredError = true;
          missingFields.push(field);
        }
      }

      // Find matching error tag
      const priorityRules = ['required', 'unique'];
      let tag: string | null = null;

      for (const priority of priorityRules) {
        const ruleKey = `${field}.${priority}`;
        if (errorMessages[ruleKey]?.tag) {
          tag = errorMessages[ruleKey].tag;
          break;
        }
      }

      if (!tag) {
        for (const [rule, details] of Object.entries(errorMessages)) {
          if (rule.startsWith(field) && details?.tag) {
            tag = details.tag;
            break;
          }
        }
      }

      if (tag) {
        errorTags.push(tag);
      }
    }

    const response: any = {
      status: false,
      message: 'Please fill/fix the required fields!',
      invalid_fields: hasRequiredError ? missingFields : Object.keys(invalidFields),
      tag: hasRequiredError ? ['account:authentication.errors.required_fields'] : [...new Set(errorTags)],
    };

    return NextResponse.json(response, { status: 422 });
  }

  static sendSuccess(data: any = {}, message: string = '', messageTag: string = '') {
    const response: any = {
      status: true,
    };

    if (Object.keys(data).length > 0) {
      response.data = data;
    }

    if (message) {
      response.message = message;
    }

    if (messageTag) {
      response.tag = messageTag;
    }

    return NextResponse.json(response, { status: 200 });
  }
}



