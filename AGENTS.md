<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the seven platform sections as independent TanStack leaf routes with a shared platform shell so navigation and metadata remain consistent.
- Render ECharts only after mounting and replace options with notMerge to avoid stale series when data or chart types change.
- This platform is a frontend demonstration; clearly mark simulated operational data and keep filters and exports client-side until a real plant connection is requested.
