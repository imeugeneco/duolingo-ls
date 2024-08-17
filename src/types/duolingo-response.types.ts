interface StyledString {
  text: string;
}

interface Phrase {
  text: {
    styledString: StyledString;
  };
  subtext: {
    styledString: StyledString;
  };
}

export interface Dialogue {
  element: {
    phrases: Phrase[];
  };
}

export interface ResponseData {
  elements: Array<{
    type: string;
    element: any;
  }>;
}
