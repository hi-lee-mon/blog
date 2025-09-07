# Task Completion Checklist

## After Completing Code Changes

### Code Quality
1. **Lint and Format:** Run `npm run check:fix` to auto-fix format and lint issues
2. **Build Check:** Run `npm run build` to ensure production build succeeds
3. **Type Check:** Verify TypeScript strict mode compliance

### Testing
1. **Unit Tests:** Run Vitest tests if applicable
2. **Storybook:** Check component stories if UI components were modified
3. **Manual Testing:** Test functionality in development server

### Database Changes
1. **Generate Client:** Run `npm run p:gen` if schema changed
2. **Migrations:** Run `npm run p:mig` for database changes
3. **Seed Data:** Run `npm run p:seed` if seed data updated

### Final Verification
1. **Development Server:** Ensure `npm run dev` starts without errors
2. **No TypeScript Errors:** Verify strict mode compliance
3. **No Lint Warnings:** Clean Biome output
4. **Git Status:** Review changes before commit