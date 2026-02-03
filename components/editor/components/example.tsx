import React, { useState } from 'react'
import { DEFAULT_EDITOR_CONFIG } from '../constants'
import { TextEditor } from '../index'

const Example: React.FC = () => {
    const [content, setContent] = useState<string>('')

    return (
        <div className="mx-auto max-w-4xl p-6">
            <TextEditor
                value={content}
                onChange={setContent}
                editable={true}
                config={DEFAULT_EDITOR_CONFIG}
                className="mb-4"
                autoFocus={false}
                disabled={false}
                onBlur={() => console.log('Editor blurred')}
                onFocus={() => console.log('Editor focused')}
                onKeyDown={(e) => console.log('Key pressed:', e)}
                onReady={(editor) => console.log('Editor ready:', editor)}
                onError={(error) => console.error('Editor error:', error)}
            />
        </div>
    )
}

export default Example
