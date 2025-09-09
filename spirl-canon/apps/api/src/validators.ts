export const PMBPayloadSchema = {
  type: "object",
  required: ["id", "world", "alphaDeg", "epsilon"],
};

export const PanelSchema = {
  type: "object",
  required: ["id", "glyph"],
};
