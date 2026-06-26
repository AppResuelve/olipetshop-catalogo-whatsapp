import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader, Plus, Trash2, GripVertical, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { Button, Input, Textarea, Select } from '../../components/ui/Form'
import ImageUpload from '../../components/ImageUpload'
import { useAlert } from '../../components/ui/AlertContext'
import api from '../../../api/admin'

const EMPTY_VARIANT = {
  name: '', price: 0, duration_minutes: '', sort_order: 0, status: 'active', modifiers: [],
}

const EMPTY_MODIFIER = {
  name: '', price: 0, is_required: false, max_selection: 1, sort_order: 0, status: 'active',
}

const EMPTY_SERVICE = {
  name: '', slug: '', description: '', images: [], price: 0, status: 'active', variants: [],
}

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 255)

function VariantCard({ variant, index, onChange, onRemove, isFirst, isLast, onMoveUp, onMoveDown }) {
  const [expanded, setExpanded] = useState(true)

  const handleVariantChange = (field, value) => {
    const updated = { ...variant, [field]: value }
    onChange(index, updated)
  }

  const handleModifierChange = (modIndex, field, value) => {
    const newModifiers = [...variant.modifiers]
    newModifiers[modIndex] = { ...newModifiers[modIndex], [field]: value }
    onChange(index, { ...variant, modifiers: newModifiers })
  }

  const addModifier = () => {
    onChange(index, { ...variant, modifiers: [...variant.modifiers, { ...EMPTY_MODIFIER }] })
  }

  const removeModifier = (modIndex) => {
    const newModifiers = variant.modifiers.filter((_, i) => i !== modIndex)
    onChange(index, { ...variant, modifiers: newModifiers })
  }

  const moveModifierUp = (modIndex) => {
    if (modIndex === 0) return
    const newModifiers = [...variant.modifiers]
    ;[newModifiers[modIndex - 1], newModifiers[modIndex]] = [newModifiers[modIndex], newModifiers[modIndex - 1]]
    onChange(index, { ...variant, modifiers: newModifiers })
  }

  const moveModifierDown = (modIndex) => {
    if (modIndex >= variant.modifiers.length - 1) return
    const newModifiers = [...variant.modifiers]
    ;[newModifiers[modIndex], newModifiers[modIndex + 1]] = [newModifiers[modIndex + 1], newModifiers[modIndex]]
    onChange(index, { ...variant, modifiers: newModifiers })
  }

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800/50 border-b border-zinc-700">
        <div className="flex flex-col gap-0.5">
          <button type="button" onClick={() => onMoveUp(index)} disabled={isFirst}
            className="p-0.5 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronUp className="w-3 h-3" />
          </button>
          <button type="button" onClick={() => onMoveDown(index)} disabled={isLast}
            className="p-0.5 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        <GripVertical className="w-4 h-4 text-zinc-600" />
        <span className="text-xs font-medium text-zinc-400">Variante {index + 1}</span>
        <div className="flex-1" />
        <button type="button" onClick={() => setExpanded(!expanded)}
          className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <button type="button" onClick={() => onRemove(index)}
          className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {expanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input label="Nombre" value={variant.name}
              onChange={(e) => handleVariantChange('name', e.target.value)}
              placeholder="Chico, Mediano..." className="sm:col-span-2" />
            <Input label="Precio" type="number" value={variant.price}
              onChange={(e) => handleVariantChange('price', e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Duración (min)</span>
              </label>
              <input type="number" value={variant.duration_minutes}
                onChange={(e) => handleVariantChange('duration_minutes', e.target.value)}
                placeholder="Opcional"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors text-sm" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-400">Modificadores</span>
              <button type="button" onClick={addModifier}
                className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                <Plus className="w-3 h-3" /> Agregar modificador
              </button>
            </div>

            {variant.modifiers.length === 0 ? (
              <p className="text-xs text-zinc-600 italic">Sin modificadores</p>
            ) : (
              <div className="space-y-2">
                {variant.modifiers.map((mod, modIndex) => (
                  <div key={modIndex} className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                    <div className="flex flex-col gap-0.5">
                      <button type="button" onClick={() => moveModifierUp(modIndex)} disabled={modIndex === 0}
                        className="p-0.5 text-zinc-600 hover:text-zinc-400 disabled:opacity-30">
                        <ChevronUp className="w-2.5 h-2.5" />
                      </button>
                      <button type="button" onClick={() => moveModifierDown(modIndex)} disabled={modIndex >= variant.modifiers.length - 1}
                        className="p-0.5 text-zinc-600 hover:text-zinc-400 disabled:opacity-30">
                        <ChevronDown className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <input type="text" value={mod.name}
                      onChange={(e) => handleModifierChange(modIndex, 'name', e.target.value)}
                      placeholder="Nombre"
                      className="flex-1 min-w-0 px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 text-sm" />

                    <input type="number" value={mod.price}
                      onChange={(e) => handleModifierChange(modIndex, 'price', e.target.value)}
                      placeholder="+$"
                      className="w-20 px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 text-sm" />

                    <label className="flex items-center gap-1.5 text-xs text-zinc-400 whitespace-nowrap cursor-pointer select-none">
                      <input type="checkbox" checked={mod.is_required}
                        onChange={(e) => handleModifierChange(modIndex, 'is_required', e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-zinc-600 bg-zinc-800 text-cyan-500 focus:ring-cyan-500/50" />
                      Req.
                    </label>

                    <input type="number" value={mod.max_selection ?? ''}
                      onChange={(e) => handleModifierChange(modIndex, 'max_selection', e.target.value ? Number(e.target.value) : null)}
                      placeholder="Max"
                      className="w-14 px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 text-sm text-center" />

                    <button type="button" onClick={() => removeModifier(modIndex)}
                      className="p-1 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ServiceForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const Alert = useAlert()
  const [form, setForm] = useState(EMPTY_SERVICE)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState('')
  const [slugManual, setSlugManual] = useState(false)

  useEffect(() => {
    if (!id) return
    api.get(`/admin/services/${id}`)
      .then(({ data }) => {
        setForm({
          name: data.name || '', slug: data.slug || '',
          description: data.description || '', images: data.images || [],
          price: data.price || 0, status: data.status || 'active',
          variants: (data.variants || []).map(v => ({
            id: v.id, name: v.name || '', price: v.price || 0,
            duration_minutes: v.duration_minutes || '',
            sort_order: v.sort_order || 0, status: v.status || 'active',
            modifiers: (v.modifiers || []).map(m => ({
              id: m.id, name: m.name || '', price: m.price || 0,
              is_required: m.is_required || false,
              max_selection: m.max_selection ?? 1,
              sort_order: m.sort_order || 0, status: m.status || 'active',
            })),
          })),
        })
        setSlugManual(true)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (field, value) => {
    const next = { ...form, [field]: value }
    if (field === 'name' && !slugManual) next.slug = slugify(value)
    setForm(next)
  }

  const handleVariantChange = (index, variant) => {
    const newVariants = [...form.variants]
    newVariants[index] = variant
    setForm({ ...form, variants: newVariants })
  }

  const addVariant = () => {
    setForm({ ...form, variants: [...form.variants, { ...EMPTY_VARIANT, modifiers: [] }] })
  }

  const removeVariant = (index) => {
    setForm({ ...form, variants: form.variants.filter((_, i) => i !== index) })
  }

  const moveVariantUp = (index) => {
    if (index === 0) return
    const newVariants = [...form.variants]
    ;[newVariants[index - 1], newVariants[index]] = [newVariants[index], newVariants[index - 1]]
    setForm({ ...form, variants: newVariants })
  }

  const moveVariantDown = (index) => {
    if (index >= form.variants.length - 1) return
    const newVariants = [...form.variants]
    ;[newVariants[index], newVariants[index + 1]] = [newVariants[index + 1], newVariants[index]]
    setForm({ ...form, variants: newVariants })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { Alert.fire({ message: 'El nombre es obligatorio', type: 'warning' }); return }
    if (!form.slug.trim()) handleChange('slug', slugify(form.name))

    setError('')
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        variants: form.variants.map(v => ({
          ...(v.id && { id: v.id }),
          name: v.name,
          price: Number(v.price) || 0,
          duration_minutes: v.duration_minutes ? Number(v.duration_minutes) : null,
          sort_order: v.sort_order || 0,
          status: v.status || 'active',
          modifiers: v.modifiers.map(m => ({
            ...(m.id && { id: m.id }),
            name: m.name,
            price: Number(m.price) || 0,
            is_required: m.is_required || false,
            max_selection: m.max_selection ?? null,
            sort_order: m.sort_order || 0,
            status: m.status || 'active',
          })),
        })),
      }
      if (isEditing) {
        await api.put(`/admin/services/${id}`, payload)
      } else {
        await api.post('/admin/services', payload)
      }
      Alert.fire({ message: isEditing ? 'Servicio actualizado' : 'Servicio creado', type: 'success' })
      navigate('/dashboard/services')
    } catch (err) {
      let msg = 'Error al guardar'
      try { const b = typeof err.response?.data === 'string' ? JSON.parse(err.response.data) : err.response?.data; msg = b?.error || b?.message || msg } catch {}
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-6 h-6 animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => navigate('/dashboard/services')} className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /><span className="text-sm">Volver a servicios</span>
      </button>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 pb-24 lg:pb-0">
        <h1 className="text-2xl font-bold text-zinc-100">{isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}</h1>

        {error && <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        <ImageUpload images={form.images} onChange={(imgs) => handleChange('images', imgs)} max={2} folder="servicios" />

        <Input label="Nombre" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
        <Input
          label="Slug" value={form.slug}
          onChange={(e) => { setSlugManual(true); handleChange('slug', slugify(e.target.value)) }}
          placeholder="nombre-del-servicio" required
        />
        <Textarea label="Descripción" value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Descripción del servicio" />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Precio base" type="number" value={form.price} onChange={(e) => handleChange('price', e.target.value)} />
          <Select label="Estado" value={form.status} onChange={(e) => handleChange('status', e.target.value)}
            options={[{ value: 'active', label: 'Activo' }, { value: 'draft', label: 'Borrador' }]} />
        </div>

        <div className="border-t border-zinc-800 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">Variantes</h2>
              <p className="text-xs text-zinc-500">Opciones del servicio (ej: Chico, Mediano, Grande)</p>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={addVariant}>
              <Plus className="w-3.5 h-3.5" /> Agregar variante
            </Button>
          </div>

          {form.variants.length === 0 ? (
            <div className="text-center py-8 rounded-xl border border-dashed border-zinc-700">
              <p className="text-sm text-zinc-500">Sin variantes</p>
              <p className="text-xs text-zinc-600 mt-1">El servicio se mostrará con el precio base</p>
            </div>
          ) : (
            <div className="space-y-3">
              {form.variants.map((variant, index) => (
                <VariantCard
                  key={index}
                  variant={variant}
                  index={index}
                  onChange={handleVariantChange}
                  onRemove={removeVariant}
                  isFirst={index === 0}
                  isLast={index === form.variants.length - 1}
                  onMoveUp={moveVariantUp}
                  onMoveDown={moveVariantDown}
                />
              ))}
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 lg:static flex gap-3 justify-end px-4 pb-8 pt-4 lg:p-0 lg:pt-2 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 lg:border-0 lg:bg-transparent z-20">
          <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/services')}>Cancelar</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear servicio'}</Button>
        </div>
      </form>
    </div>
  )
}
