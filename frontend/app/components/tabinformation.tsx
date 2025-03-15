// supported languages
export const SUPPORTED_LANGUAGES = [
  "python",
  "javascript",
  "typescript",
  "java",
  "c++",
  "c#",
];

export const DEFAULT_CLASS_TEXT = `
class BaseState(StateComponent):
    def __init__(self, name: str, id: str):
        self._name = name
        self._id = id
        
    def update(self):
        pass
`;
