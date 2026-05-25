'use server';

const FORM_URL =
  'https://docs.google.com/forms/d/1JFmGZspSNFyXyEwH05wm2MTWlvMUQyZ4HeIDWzjAkR0/formResponse';

export async function submitPolicySuggestion(formData: FormData): Promise<{ success: boolean }> {
  const area = (formData.get('area') as string | null)?.trim() ?? '';
  const areaOther = (formData.get('areaOther') as string | null)?.trim() ?? '';
  const region = (formData.get('region') as string | null)?.trim() ?? '';
  const title = (formData.get('title') as string | null)?.trim() ?? '';
  const description = (formData.get('description') as string | null)?.trim() ?? '';

  const body = new URLSearchParams();

  if (area === '기타') {
    body.set('entry.785651774', '__other_option__');
    if (areaOther) body.set('entry.785651774.other_option_response', areaOther);
  } else if (area) {
    body.set('entry.785651774', area);
  }

  if (region) body.set('entry.659861963', region);
  body.set('entry.1118220631', title);
  body.set('entry.1514396429', description);

  try {
    await fetch(FORM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}
