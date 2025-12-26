export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  error,
  placeholder,
  rows,
  options,
  helpText,
  ...props
}) {
  const inputId = `field-${name}`

  return (
    <div style={{ marginBottom: '20px' }}>
      <label
        htmlFor={inputId}
        style={{
          display: 'block',
          marginBottom: '8px',
          color: '#4a5568',
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        {label}
        {required && <span style={{ color: '#f56565', marginLeft: '4px' }}>*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={inputId}
          name={name}
          value={value || ''}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={rows || 4}
          style={{
            width: '100%',
            padding: '12px',
            border: error ? '1px solid #f56565' : '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
          {...props}
        />
      ) : type === 'select' ? (
        <select
          id={inputId}
          name={name}
          value={value || ''}
          onChange={onChange}
          required={required}
          style={{
            width: '100%',
            padding: '12px',
            border: error ? '1px solid #f56565' : '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'inherit',
            background: 'white',
            boxSizing: 'border-box',
          }}
          {...props}
        >
          <option value="">Select {label}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          value={value || ''}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '12px',
            border: error ? '1px solid #f56565' : '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
          {...props}
        />
      )}

      {error && (
        <p style={{ color: '#f56565', fontSize: '12px', marginTop: '4px', margin: 0 }}>
          {error}
        </p>
      )}
      {helpText && !error && (
        <p style={{ color: '#718096', fontSize: '12px', marginTop: '4px', margin: 0 }}>
          {helpText}
        </p>
      )}
    </div>
  )
}

