use css_in_js_parser::{parse_css, CssError, ParsedCss, ParserState};
use swc_core::common::{BytePos, Span};
use swc_core::ecma::ast::TplElement;

/// Parses the css code of a template quasi
///
/// `css_code` is the raw quasi, with an optional `;` at the end
/// `start` skips the bytes which belong to the expression before the quasi
/// e.g. the unit in styled.button`left: ${({$x}) => $x}px;` -> `left: var(--left);`
///
/// The raw quasi escapes a backslash, so each `\\` becomes `\` before parsing
/// e.g. styled.button`content: "\\2022"` -> `content: "\2022"`
pub fn parse_quasi(css_code: &str, start: usize, state: Option<ParserState>) -> ParsedCss {
  parse_css(&css_code[start..].replace("\\\\", "\\"), state)
}

/// Maps an error of `parse_quasi` to its span in the source file
/// `start` is the same as in `parse_quasi`
pub fn css_error_span(quasi: &TplElement, start: usize, error: &CssError) -> Span {
  let range = error.range();
  let lo = source_position(quasi, start, range.start);
  let hi = source_position(quasi, start, range.end).max(lo + BytePos(1));
  Span::new(lo, hi)
}

/// Maps a byte offset in the parsed css of a quasi to its position in the source file
/// `start` is the same as in `parse_quasi`
pub fn source_position(quasi: &TplElement, start: usize, offset: usize) -> BytePos {
  // Each `\\` before the offset is one byte longer in the source than in the parsed css
  let escaped_backslashes = quasi
    .raw
    .get(start..)
    .unwrap_or_default()
    .match_indices("\\\\")
    .enumerate()
    .take_while(|(index, (position, _))| position - index < offset)
    .count();
  let position = (start + offset + escaped_backslashes).min(quasi.raw.len());
  quasi.span.lo + BytePos(position as u32)
}

#[cfg(test)]
mod tests {
  use super::*;

  fn quasi(raw: &str) -> TplElement {
    TplElement {
      span: Span::new(BytePos(100), BytePos(100 + raw.len() as u32)),
      tail: true,
      cooked: None,
      raw: raw.into(),
    }
  }

  /// The source text of each error span
  fn error_sources(raw: &str, css_code: &str, start: usize) -> Vec<String> {
    let quasi = quasi(raw);
    parse_quasi(css_code, start, None)
      .errors
      .iter()
      .map(|error| css_error_span(&quasi, start, error))
      .map(|span| raw[(span.lo.0 - 100) as usize..(span.hi.0 - 100) as usize].to_string())
      .collect()
  }

  #[test]
  fn maps_errors_to_the_raw_quasi() {
    let raw = "color red; }";
    assert_eq!(error_sources(raw, raw, 0), vec!["color red", "}"]);
  }

  #[test]
  fn maps_errors_after_escaped_backslashes() {
    let raw = r#"content: "\\2022 \\2023"; }"#;
    assert_eq!(error_sources(raw, raw, 0), vec!["}"]);
  }

  #[test]
  fn maps_errors_after_a_skipped_unit() {
    let raw = "px; }";
    assert_eq!(error_sources(raw, raw, 2), vec!["}"]);
  }

  #[test]
  fn keeps_errors_of_an_added_semicolon_inside_the_quasi() {
    let raw = "color red";
    assert_eq!(error_sources(raw, "color red;", 0), vec!["color red"]);
  }
}
