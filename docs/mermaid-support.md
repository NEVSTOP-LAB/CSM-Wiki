# Mermaid Diagram Support

This wiki now supports [Mermaid.js](https://mermaid.js.org/) for rendering diagrams directly in Markdown files.

## Usage

To add a Mermaid diagram to any page, use a fenced code block with the `mermaid` language identifier:

\`\`\`mermaid
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
\`\`\`

## Supported Diagram Types

Mermaid supports various diagram types:

- **Sequence Diagrams**: Show interactions between different actors
- **Flowcharts**: Visualize workflows and decision trees
- **Class Diagrams**: Display class structures and relationships
- **State Diagrams**: Model state transitions
- **Entity Relationship Diagrams**: Show database relationships
- **Gantt Charts**: Project timelines and schedules
- **Pie Charts**: Data visualization
- And more...

## Examples

### Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant A as Module A
    participant B as Module B
    A->>B: Send Message
    B-->>A: Response
\`\`\`

### Flowchart

\`\`\`mermaid
flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
\`\`\`

## More Information

For complete documentation and examples, visit the [Mermaid documentation](https://mermaid.js.org/).

## Implementation Details

The wiki uses Mermaid.js v10.9.1 with the following configuration:
- Security Level: `strict` (prevents XSS attacks)
- Theme: `default`
- HTML Labels: Enabled for flowcharts
- Responsive: Diagrams automatically adjust to page width
