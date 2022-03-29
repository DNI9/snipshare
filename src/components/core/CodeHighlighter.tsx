import { Skeleton, Text } from '@chakra-ui/react';
import CodeEditorType, {
  TextareaCodeEditorProps,
} from '@uiw/react-textarea-code-editor';
import dynamic from 'next/dynamic';

import { SnippetType } from '~/types/snippet';

import '@uiw/react-textarea-code-editor/dist.css';

const CodeEditor = dynamic(
  () =>
    import('@uiw/react-textarea-code-editor').then(mod => mod.default as any),
  {
    ssr: false,
    loading: () => (
      <Skeleton h={200} endColor="#f5f5f5">
        <Text>Loading snippet...</Text>
      </Skeleton>
    ),
  }
) as typeof CodeEditorType;

type Props = {
  snippet: Pick<SnippetType, 'content' | 'language'>;
  editorProps?: TextareaCodeEditorProps &
    React.RefAttributes<HTMLTextAreaElement>;
};

export const CodeHighlighter = ({ snippet, editorProps }: Props) => {
  return (
    <CodeEditor
      readOnly
      value={snippet.content}
      language={snippet.language}
      padding={15}
      minHeight={25}
      style={{
        borderRadius: 5,
        fontSize: 15,
        backgroundColor: '#f5f5f5',
        fontFamily:
          'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
      }}
      {...editorProps}
    />
  );
};
